"use client";

import { useState, useMemo } from "react";
import { useMonitoringStore } from "@/store/monitoringStore";
import { Badge, severityTone } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { AlertDetailDrawer } from "@/components/monitoring/AlertDetailDrawer";
import { formatRelative } from "@/lib/format";
import type { AttackEvent, Severity } from "@/lib/types";

export default function AlertsPage() {
  const attacks = useMonitoringStore((s) => s.attacks);
  const [selected, setSelected] = useState<AttackEvent | null>(null);
  const [sevFilter, setSevFilter] = useState<Severity | "all">("all");

  const filtered = useMemo(() => {
    if (sevFilter === "all") return attacks;
    return attacks.filter((a) => a.severity === sevFilter);
  }, [attacks, sevFilter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Alerts</h1>
          <p className="text-xs text-muted-foreground">
            All detected attacks and security events
          </p>
        </div>
        <select
          value={sevFilter}
          onChange={(e) => setSevFilter(e.target.value as Severity | "all")}
          className="h-8 rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="all">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-xs">
            <thead className="border-b border-border bg-secondary/30">
              <tr className="text-left text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Severity</th>
                <th className="px-4 py-2.5 font-medium">Type</th>
                <th className="px-4 py-2.5 font-medium">Source</th>
                <th className="px-4 py-2.5 font-medium">Target</th>
                <th className="px-4 py-2.5 font-medium">Method</th>
                <th className="px-4 py-2.5 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    No alerts to display
                  </td>
                </tr>
              )}
              {filtered.slice(0, 100).map((a) => (
                <tr
                  key={a.id}
                  onClick={() => setSelected(a)}
                  className="cursor-pointer border-b border-border/50 transition-colors hover:bg-secondary/40"
                >
                  <td className="px-4 py-2.5">
                    <Badge tone={severityTone(a.severity)}>{a.severity}</Badge>
                  </td>
                  <td className="px-4 py-2.5 font-medium text-foreground">{a.type}</td>
                  <td className="px-4 py-2.5 font-mono-tabular text-muted-foreground">{a.sourceIp}</td>
                  <td className="px-4 py-2.5 font-mono-tabular text-muted-foreground">{a.targetEndpoint}</td>
                  <td className="px-4 py-2.5">
                    <Badge tone="outline">{a.method}</Badge>
                  </td>
                  <td className="px-4 py-2.5 font-mono-tabular text-muted-foreground">
                    {formatRelative(a.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <AlertDetailDrawer attack={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
