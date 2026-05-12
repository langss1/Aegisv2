import { create } from "zustand";
import { bus } from "@/engine/eventBus";
import type { AuditEntry } from "@/lib/types";

interface AuditState {
  entries: AuditEntry[];
  _initialized: boolean;
  init: () => void;
}

const MAX_ENTRIES = 300;

export const useAuditStore = create<AuditState>((set, get) => ({
  entries: [],
  _initialized: false,

  init: () => {
    if (get()._initialized) return;
    set({ _initialized: true });

    bus.on("audit", (entry) => {
      set((s) => ({
        entries: [entry, ...s.entries].slice(0, MAX_ENTRIES),
      }));
    });
  },
}));
