import { create } from "zustand";
import { bus } from "@/engine/eventBus";
import { nid } from "@/lib/id";
import type { HealingAction } from "@/lib/types";
import { fetchHealings, updateHealingStatus, pollTelegramCallbacks } from "@/lib/apiClient";

interface HealingState {
  actions: HealingAction[];
  sessionId: string | null;
  _initialized: boolean;
  init: (sessionId: string) => void;
  reverseAction: (id: string, by: string) => void;
  approveAction: (id: string, by: string) => void;
  refreshFromServer: () => Promise<void>;
}

export const useHealingStore = create<HealingState>((set, get) => ({
  actions: [],
  sessionId: null,
  _initialized: false,

  init: async (sessionId: string) => {
    set({ sessionId });

    // Initial fetch from server
    const data = await fetchHealings(sessionId);
    if (data.ok && data.healings) {
      set({ actions: data.healings, _initialized: true });
    }

    bus.on("healing", (action) => {
      set((s) => ({ actions: [action, ...s.actions] }));
    });

    // Poll Telegram callbacks every 3 seconds
    const pollCallbacks = async () => {
      try { await pollTelegramCallbacks(); } catch (err) {
        console.error("[HealingStore] Callback poll error:", err);
      }
    };
    setInterval(pollCallbacks, 3000);

    // Poll server every 2 seconds (server is always source of truth)
    const pollServer = async () => {
      try {
        const sid = get().sessionId;
        if (!sid) return;
        const data = await fetchHealings(sid);
        if (data.ok && data.healings) {
          const serverHealings = data.healings as HealingAction[];
          const currentActions = get().actions;
          
          // Emit logs for new healings
          const currentIds = new Set(currentActions.map(a => a.id));
          for (const h of serverHealings) {
            if (!currentIds.has(h.id)) {
              bus.emit("log", {
                id: nid("log"),
                ts: Date.now(),
                level: "warn",
                source: "aegis",
                msg: `Self-healing applied: ${h.attackType} attack on ${h.targetEndpoint || 'endpoint'} - Patch: ${h.patch}`,
                healingId: h.id,
              });
            }
          }

          // Emit logs for status changes
          for (const serverAction of serverHealings) {
            const existing = currentActions.find(a => a.id === serverAction.id);
            if (existing && existing.status !== serverAction.status) {
              if (serverAction.status === "Approved") {
                bus.emit("log", {
                  id: nid("log"),
                  ts: Date.now(),
                  level: "info",
                  source: "telegram",
                  msg: `Healing approved: ${serverAction.patch}`,
                  healingId: serverAction.id,
                });
              } else if (serverAction.status === "Reversed") {
                bus.emit("log", {
                  id: nid("log"),
                  ts: Date.now(),
                  level: "warn",
                  source: "telegram",
                  msg: `Healing reversed: ${serverAction.patch}`,
                  healingId: serverAction.id,
                });
              }
            }
          }

          // Always use server data as source of truth
          set({ actions: serverHealings });
        }
      } catch (err) {
        console.error("[HealingStore] Poll error:", err);
      }
    };
    setInterval(pollServer, 2000);

    // Expiry checker every 10s
    const checkExpiry = () => {
      const now = Date.now();
      set((s) => ({
        actions: s.actions.map((a) => {
          if (a.status === "Applied" && now > a.reverseDeadline) {
            const updated = { ...a, status: "Expired" as const };
            bus.emit("healing-update", updated);
            bus.emit("audit", {
              id: nid("aud"),
              ts: now,
              actor: "system",
              actorName: "AEGIS Engine",
              action: "apply-patch",
              refId: a.id,
              refLabel: `${a.patch} expired (window closed)`,
              note: "Reverse window expired, patch is now permanent",
            });
            return updated;
          }
          return a;
        }),
      }));
    };
    setInterval(checkExpiry, 10000);
  },

  refreshFromServer: async () => {
    const sid = get().sessionId;
    if (!sid) return;
    console.log("[HealingStore] refreshFromServer called");
    const data = await fetchHealings(sid);
    if (data.ok && data.healings) {
      set({ actions: data.healings });
    }
  },

  reverseAction: async (id: string, by: string) => {
    const now = Date.now();
    
    // Optimistic update
    set((s) => ({
      actions: s.actions.map((a) => {
        if (a.id !== id || (a.status !== "Applied" && a.status !== "Approved")) return a;
        const updated: HealingAction = { ...a, status: "Reversed", reversedAt: now, reversedBy: by };
        bus.emit("healing-update", updated);
        bus.emit("log", {
          id: nid("log"),
          ts: now,
          level: "warn",
          source: "engine",
          msg: `Healing reversed by ${by}: ${a.patch}`,
          healingId: a.id,
        });
        bus.emit("audit", {
          id: nid("aud"),
          ts: now,
          actor: "operator",
          actorName: by,
          action: "reverse-patch",
          refId: a.id,
          refLabel: `Reversed: ${a.patch}`,
          note: `Manually reversed by ${by}`,
        });
        return updated;
      }),
    }));

    // Sync to server
    await updateHealingStatus(id, "reverse", by);
  },

  approveAction: async (id: string, by: string) => {
    const now = Date.now();
    
    // Optimistic update
    set((s) => ({
      actions: s.actions.map((a) => {
        if (a.id !== id || a.status !== "Applied") return a;
        const updated: HealingAction = { ...a, status: "Approved", approvedAt: now, approvedBy: by };
        bus.emit("healing-update", updated);
        bus.emit("log", {
          id: nid("log"),
          ts: now,
          level: "info",
          source: "engine",
          msg: `Healing approved and locked by ${by}: ${a.patch}`,
          healingId: a.id,
        });
        bus.emit("audit", {
          id: nid("aud"),
          ts: now,
          actor: "operator",
          actorName: by,
          action: "approve-patch",
          refId: a.id,
          refLabel: `Approved: ${a.patch}`,
          note: `Patch locked and marked as permanent by ${by}`,
        });
        return updated;
      }),
    }));

    // Sync to server
    await updateHealingStatus(id, "approve", by);
  },
}));
