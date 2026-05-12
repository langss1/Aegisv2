"use client";

import { useEffect } from "react";
import { useMonitoringStore } from "@/store/monitoringStore";
import { useHealingStore } from "@/store/healingStore";
import { useLogStore } from "@/store/logStore";
import { useAuditStore } from "@/store/auditStore";
import { StatusBar } from "@/components/monitoring/StatusBar";
import { TrafficChart } from "@/components/monitoring/TrafficChart";
import { ThreatFeed } from "@/components/monitoring/ThreatFeed";
import { LiveCodeMonitor } from "@/components/monitoring/LiveCodeMonitor";

export default function DashboardPage() {
  const initMonitoring = useMonitoringStore((s) => s.init);
  const initHealing = useHealingStore((s) => s.init);
  const initLog = useLogStore((s) => s.init);
  const initAudit = useAuditStore((s) => s.init);

  useEffect(() => {
    initMonitoring();
    initHealing();
    initLog();
    initAudit();
  }, [initMonitoring, initHealing, initLog, initAudit]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold text-foreground">Monitoring Dashboard</h1>
        <p className="text-xs text-muted-foreground">
          Real-time traffic monitoring and threat detection
        </p>
      </div>

      <StatusBar />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TrafficChart />
        </div>
        <div>
          <ThreatFeed />
        </div>
      </div>

      {/* Live Code Monitor Section */}
      <LiveCodeMonitor />
    </div>
  );
}
