"use client";

import { useEffect } from "react";
import { useRealtimeSource } from "@/engine/realtime";
import { useMonitoringStore } from "@/store/monitoringStore";
import { useHealingStore } from "@/store/healingStore";
import { useLogStore } from "@/store/logStore";
import { useAuditStore } from "@/store/auditStore";
import { useSettingsStore } from "@/store/settingsStore";

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const initMonitoring = useMonitoringStore((s) => s.init);
  const initHealing = useHealingStore((s) => s.init);
  const initLog = useLogStore((s) => s.init);
  const initAudit = useAuditStore((s) => s.init);
  const initSettings = useSettingsStore((s) => s.init);

  // Initialize all stores BEFORE realtime source starts emitting events
  useEffect(() => {
    initSettings();
    initMonitoring();
    initHealing();
    initLog();
    initAudit();
  }, [initMonitoring, initHealing, initLog, initAudit, initSettings]);

  useRealtimeSource();
  
  return <>{children}</>;
}
