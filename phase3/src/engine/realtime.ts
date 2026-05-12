"use client";

import { useEffect, useRef } from "react";
import { startSimulator, stopSimulator } from "./simulator";
import { initHealingEngine } from "./healingEngine";
import { useSettingsStore } from "@/store/settingsStore";
import { useHealingStore } from "@/store/healingStore";
import { bus } from "./eventBus";
import { notifyTelegram, pollTelegramCallbacks } from "@/lib/apiClient";
import type { AttackEvent, HealingAction } from "@/lib/types";

export function useRealtimeSource() {
  const policies = useSettingsStore((s) => s.policies);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    initHealingEngine(policies);
    startSimulator(2000);

    // Track recent attacks so we can correlate them with healing actions
    const recentAttacks = new Map<string, AttackEvent>();
    const unsubAttack = bus.on("attack", (attack: AttackEvent) => {
      recentAttacks.set(attack.id, attack);
      // Clean up old entries (keep last 100)
      if (recentAttacks.size > 100) {
        const firstKey = recentAttacks.keys().next().value;
        if (firstKey) recentAttacks.delete(firstKey);
      }
    });

    // Notify Telegram on healing events (only Critical/High)
    const unsub = bus.on("healing", (action: HealingAction) => {
      if (action.severity === "Critical" || action.severity === "High") {
        const attack = action.attackId ? recentAttacks.get(action.attackId) : undefined;
        notifyTelegram("healing", {
          id: action.id,
          attackType: action.attackType,
          severity: action.severity,
          patch: action.patch,
          wafRuleId: action.wafRuleId,
          // Include attack details for server-side registration
          sourceIp: attack?.sourceIp || "unknown",
          targetEndpoint: attack?.targetEndpoint || "unknown",
          method: attack?.method || "GET",
          payload: attack?.payloadSnippet || "",
          appliedAt: action.appliedAt,
          reverseDeadline: action.reverseDeadline,
        });
      }
    });

    // Poll Telegram for HITL callbacks every 3s
    const pollId = setInterval(async () => {
      try {
        console.log("[Realtime] Polling Telegram callbacks...");
        const response = await pollTelegramCallbacks();
        console.log("[Realtime] Poll response:", response);
        const { actions } = response;
        if (actions && actions.length > 0) {
          console.log("[Realtime] Got actions, refreshing from server...");
          // Force refresh from server after processing Telegram callbacks
          // This ensures UI reflects the latest status from server
          await useHealingStore.getState().refreshFromServer();
          
          // Emit log events for the actions
          for (const a of actions) {
            if (a.action === "revert") {
              bus.emit("log", {
                id: `log_${Date.now()}`,
                ts: Date.now(),
                level: "warn",
                source: "telegram",
                msg: `Healing ${a.healingId} reverted via Telegram`,
                healingId: a.healingId,
              });
            } else if (a.action === "approve") {
              bus.emit("log", {
                id: `log_${Date.now()}`,
                ts: Date.now(),
                level: "info",
                source: "telegram",
                msg: `Healing ${a.healingId} approved via Telegram`,
                healingId: a.healingId,
              });
            }
          }
        }
      } catch (err) {
        console.error("[Realtime] Poll error:", err);
      }
    }, 3000);

    return () => {
      stopSimulator();
      unsub();
      unsubAttack();
      clearInterval(pollId);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update policies in the healing engine when they change
  useEffect(() => {
    if (initialized.current) {
      import("./healingEngine").then(({ updatePolicies }) => {
        updatePolicies(policies);
      });
    }
  }, [policies]);
}
