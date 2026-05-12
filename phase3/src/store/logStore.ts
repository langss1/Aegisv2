import { create } from "zustand";
import { bus } from "@/engine/eventBus";
import type { LogLine } from "@/lib/types";

interface LogState {
  logs: LogLine[];
  paused: boolean;
  _initialized: boolean;
  init: () => void;
  togglePause: () => void;
  clear: () => void;
}

const MAX_LOGS = 500;

export const useLogStore = create<LogState>((set, get) => ({
  logs: [],
  paused: false,
  _initialized: false,

  init: () => {
    if (get()._initialized) return;
    set({ _initialized: true });

    bus.on("log", (line) => {
      if (get().paused) return;
      set((s) => ({
        logs: [line, ...s.logs].slice(0, MAX_LOGS),
      }));
    });
  },

  togglePause: () => set((s) => ({ paused: !s.paused })),
  clear: () => set({ logs: [] }),
}));
