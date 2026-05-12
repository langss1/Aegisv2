"use client";

import { Activity, ShieldAlert, ShieldCheck, Database } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { useMonitoringStore } from "@/store/monitoringStore";
import { useHealingStore } from "@/store/healingStore";

export function StatusBar() {
  const traffic = useMonitoringStore((s) => s.traffic);
  const totalBlocked = useMonitoringStore((s) => s.totalBlocked);
  const healingActions = useHealingStore((s) => s.actions);

  const lastTick = traffic[traffic.length - 1];
  const throughput = lastTick ? lastTick.normal + lastTick.attack : 0;
  const activeSnapshots = healingActions.filter((a) => a.status === "Applied").length;

  const cards = [
    { icon: Activity, label: "Throughput", value: `${throughput} req/s`, color: "text-blue-400" },
    { icon: ShieldAlert, label: "Attacks Blocked", value: totalBlocked.toString(), color: "text-destructive" },
    { icon: ShieldCheck, label: "Active Patches", value: activeSnapshots.toString(), color: "text-success" },
    { icon: Database, label: "Snapshots", value: activeSnapshots.toString(), color: "text-warning" },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <Card key={c.label}>
          <CardContent className="flex items-center gap-3 p-4">
            <div className={`rounded-md bg-secondary p-2 ${c.color}`}>
              <c.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{c.label}</p>
              <p className="text-lg font-bold font-mono-tabular">{c.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
