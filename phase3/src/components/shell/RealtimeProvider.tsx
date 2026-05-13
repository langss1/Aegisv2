"use client";

import { useEffect, useRef } from "react";
import { useRealtimeSource } from "@/engine/realtime";
import { useMonitoringStore } from "@/store/monitoringStore";
import { useHealingStore } from "@/store/healingStore";
import { useLogStore } from "@/store/logStore";
import { useAuditStore } from "@/store/auditStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useSession } from "@/components/shell/SessionProvider";

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const initMonitoring = useMonitoringStore((s) => s.init);
  const switchSession  = useMonitoringStore((s) => s.switchSession);
  const initHealing    = useHealingStore((s) => s.init);
  const initLog        = useLogStore((s) => s.init);
  const initAudit      = useAuditStore((s) => s.init);
  const initSettings   = useSettingsStore((s) => s.init);

  const { activeSessionId } = useSession();
  const prevSessionId = useRef<string | null>(null);

  // Initialize all stores once settings are loaded
  useEffect(() => {
    initSettings();
    initLog();
    initAudit();
  }, [initSettings, initLog, initAudit]);

  // Initialize or switch session-specific stores when activeSessionId changes
  useEffect(() => {
    if (!activeSessionId) return;

    if (prevSessionId.current === null) {
      // First time: full init
      initMonitoring(activeSessionId);
      initHealing(activeSessionId);
    } else if (prevSessionId.current !== activeSessionId) {
      // Session switched: reload data for the new session
      switchSession(activeSessionId);
      initHealing(activeSessionId);
    }

    prevSessionId.current = activeSessionId;
  }, [activeSessionId, initMonitoring, initHealing, switchSession]);

  useRealtimeSource();

  return <>{children}</>;
}
