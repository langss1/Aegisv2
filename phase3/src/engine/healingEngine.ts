import { bus } from "./eventBus";
import { shouldHeal } from "./policies";
import { nid } from "@/lib/id";
import type { AttackEvent, HealingAction, Policy } from "@/lib/types";

const REVERSE_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

let policies: Policy[] = [];
let started = false;

export function initHealingEngine(initialPolicies: Policy[]) {
  policies = initialPolicies;

  if (started) return;
  started = true;

  bus.on("attack", (attack: AttackEvent) => {
    const matched = shouldHeal(attack.type, attack.severity, policies);
    if (!matched) return;

    const now = Date.now();
    const action: HealingAction = {
      id: nid("heal"),
      attackId: attack.id,
      attackType: attack.type,
      severity: attack.severity,
      status: "Applied",
      patch: matched.patchName,
      wafRuleId: matched.wafRuleId,
      snapshotId: nid("snap"),
      appliedAt: now,
      reverseDeadline: now + REVERSE_WINDOW_MS,
    };

    bus.emit("healing", action);

    bus.emit("log", {
      id: nid("log"),
      ts: now,
      level: "warn",
      source: "engine",
      msg: `Self-healing applied: ${matched.patchName} for ${attack.type} (${attack.severity})`,
      attackId: attack.id,
      healingId: action.id,
    });

    bus.emit("audit", {
      id: nid("aud"),
      ts: now,
      actor: "system",
      actorName: "AEGIS Engine",
      action: "apply-patch",
      refId: action.id,
      refLabel: `${matched.patchName} → ${attack.type}`,
      note: `Auto-triggered by policy ${matched.id}`,
    });
  });
}

export function updatePolicies(newPolicies: Policy[]) {
  policies = newPolicies;
}
