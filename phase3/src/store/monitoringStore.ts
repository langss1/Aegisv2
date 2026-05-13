import { create } from "zustand";
import { bus } from "@/engine/eventBus";
import type { AttackEvent, TrafficTick } from "@/lib/types";

interface MonitoringState {
  attacks: AttackEvent[];
  traffic: TrafficTick[];
  totalBlocked: number;
  sessionId: string | null;
  _initialized: boolean;
  init: (sessionId: string) => void;
  switchSession: (sessionId: string) => Promise<void>;
  refreshAttacks: () => Promise<void>;
  clearAttacks: () => Promise<void>;
}

const MAX_TRAFFIC = 60;
const MAX_ATTACKS = 200;

let _pollInterval: ReturnType<typeof setInterval> | null = null;

async function fetchAttacks(sessionId: string): Promise<AttackEvent[]> {
  try {
    const res = await fetch(`/api/attacks?sessionId=${encodeURIComponent(sessionId)}`);
    const data = await res.json();
    if (data.ok && data.attacks) {
      return data.attacks.map((a: any) => ({
        id: a.id,
        type: a.type,
        severity: a.severity,
        sourceIp: a.sourceIp,
        targetEndpoint: a.targetEndpoint,
        method: a.method,
        payload: a.payload,
        timestamp: a.timestamp,
        blocked: a.blocked ?? true,
      }));
    }
  } catch (err) {
    console.error("[MonitoringStore] Failed to fetch attacks:", err);
  }
  return [];
}

export const useMonitoringStore = create<MonitoringState>((set, get) => ({
  attacks: [],
  traffic: [],
  totalBlocked: 0,
  sessionId: null,
  _initialized: false,

  init: async (sessionId: string) => {
    set({ sessionId, _initialized: true });

    // Fetch initial attacks for this session
    const serverAttacks = await fetchAttacks(sessionId);
    set({ attacks: serverAttacks, totalBlocked: serverAttacks.length });

    // Listen for new attacks from event bus (real-time)
    bus.on("attack", (attack) => {
      set((s) => ({
        attacks: [attack, ...s.attacks].slice(0, MAX_ATTACKS),
        totalBlocked: s.totalBlocked + 1,
      }));
    });

    bus.on("traffic-tick", (tick) => {
      set((s) => ({ traffic: [...s.traffic, tick].slice(-MAX_TRAFFIC) }));
    });

    // Start polling for this session
    if (_pollInterval) clearInterval(_pollInterval);
    _pollInterval = setInterval(async () => {
      const sid = get().sessionId;
      if (!sid) return;
      const serverAttacks = await fetchAttacks(sid);
      const currentIds = new Set(get().attacks.map((a) => a.id));
      const newAttacks = serverAttacks.filter((a) => !currentIds.has(a.id));
      if (newAttacks.length > 0) {
        set((s) => ({
          attacks: [...newAttacks, ...s.attacks].slice(0, MAX_ATTACKS),
          totalBlocked: s.totalBlocked + newAttacks.length,
        }));
      }
      if (serverAttacks.length < get().attacks.length) {
        set({ attacks: serverAttacks });
      }
    }, 5000);
  },

  // Switch to a different session — clears current data and loads new session's data
  switchSession: async (sessionId: string) => {
    set({ sessionId, attacks: [], traffic: [], totalBlocked: 0 });
    const serverAttacks = await fetchAttacks(sessionId);
    set({ attacks: serverAttacks, totalBlocked: serverAttacks.length });
  },

  refreshAttacks: async () => {
    const sid = get().sessionId;
    if (!sid) return;
    const serverAttacks = await fetchAttacks(sid);
    set({ attacks: serverAttacks, totalBlocked: serverAttacks.length });
  },

  clearAttacks: async () => {
    const sid = get().sessionId;
    if (!sid) return;
    try {
      await fetch(`/api/attacks?sessionId=${encodeURIComponent(sid)}`, { method: "DELETE" });
      set({ attacks: [], totalBlocked: 0 });
    } catch (err) {
      console.error("[MonitoringStore] Failed to clear attacks:", err);
    }
  },
}));
