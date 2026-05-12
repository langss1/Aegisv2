import { create } from "zustand";
import { bus } from "@/engine/eventBus";
import type { AttackEvent, TrafficTick } from "@/lib/types";

interface MonitoringState {
  attacks: AttackEvent[];
  traffic: TrafficTick[];
  totalBlocked: number;
  _initialized: boolean;
  init: () => void;
  refreshAttacks: () => Promise<void>;
  clearAttacks: () => Promise<void>;
}

const MAX_TRAFFIC = 60;
const MAX_ATTACKS = 200;

async function fetchAttacks(): Promise<AttackEvent[]> {
  try {
    const res = await fetch("/api/attacks");
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
  _initialized: false,

  init: async () => {
    if (get()._initialized) return;
    set({ _initialized: true });

    // Fetch initial attacks from server
    const serverAttacks = await fetchAttacks();
    set({ 
      attacks: serverAttacks,
      totalBlocked: serverAttacks.length,
    });

    // Listen for new attacks from event bus (real-time)
    bus.on("attack", (attack) => {
      set((s) => ({
        attacks: [attack, ...s.attacks].slice(0, MAX_ATTACKS),
        totalBlocked: s.totalBlocked + 1,
      }));
    });

    bus.on("traffic-tick", (tick) => {
      set((s) => ({
        traffic: [...s.traffic, tick].slice(-MAX_TRAFFIC),
      }));
    });

    // Poll server every 5 seconds for new attacks
    const pollAttacks = async () => {
      const serverAttacks = await fetchAttacks();
      const currentIds = new Set(get().attacks.map(a => a.id));
      
      // Find new attacks
      const newAttacks = serverAttacks.filter(a => !currentIds.has(a.id));
      
      if (newAttacks.length > 0) {
        set((s) => ({
          attacks: [...newAttacks, ...s.attacks].slice(0, MAX_ATTACKS),
          totalBlocked: s.totalBlocked + newAttacks.length,
        }));
      }
      
      // Also update if server has fewer (some were cleared)
      if (serverAttacks.length < get().attacks.length) {
        set({ attacks: serverAttacks });
      }
    };
    
    setInterval(pollAttacks, 5000);
  },

  refreshAttacks: async () => {
    const serverAttacks = await fetchAttacks();
    set({ 
      attacks: serverAttacks,
      totalBlocked: serverAttacks.length,
    });
  },

  clearAttacks: async () => {
    try {
      await fetch("/api/attacks", { method: "DELETE" });
      set({ attacks: [], totalBlocked: 0 });
    } catch (err) {
      console.error("[MonitoringStore] Failed to clear attacks:", err);
    }
  },
}));
