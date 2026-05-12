import { create } from "zustand";
import { getDefaultPolicies } from "@/engine/policies";
import type { Policy } from "@/lib/types";

interface SettingsState {
  policies: Policy[];
  _initialized: boolean;
  init: () => void;
  togglePolicy: (id: string) => void;
  updatePolicy: (id: string, patch: Partial<Policy>) => void;
  resetPolicies: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  policies: getDefaultPolicies(),
  _initialized: false,

  init: () => {
    if (get()._initialized) return;
    set({ _initialized: true });
    // Settings are already initialized from getDefaultPolicies()
    // This method exists for consistency with other stores
  },

  togglePolicy: (id) =>
    set((s) => ({
      policies: s.policies.map((p) =>
        p.id === id ? { ...p, enabled: !p.enabled } : p,
      ),
    })),

  updatePolicy: (id, patch) =>
    set((s) => ({
      policies: s.policies.map((p) =>
        p.id === id ? { ...p, ...patch } : p,
      ),
    })),

  resetPolicies: () => set({ policies: getDefaultPolicies() }),
}));
