"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, RefreshCw, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge, severityTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useMonitoringStore } from "@/store/monitoringStore";
import { formatRelative } from "@/lib/format";
import { AlertDetailDrawer } from "./AlertDetailDrawer";
import type { AttackEvent } from "@/lib/types";

// Live relative time component
function LiveRelative({ ts }: { ts: number }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <>{formatRelative(ts, now)}</>;
}

export function ThreatFeed() {
  const attacks = useMonitoringStore((s) => s.attacks);
  const refreshAttacks = useMonitoringStore((s) => s.refreshAttacks);
  const clearAttacks = useMonitoringStore((s) => s.clearAttacks);
  const [selected, setSelected] = useState<AttackEvent | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [clearing, setClearing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshAttacks();
    setRefreshing(false);
  };

  const handleClear = async () => {
    if (confirm("Are you sure you want to clear all threat logs?")) {
      setClearing(true);
      await clearAttacks();
      setClearing(false);
    }
  };

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            Threat Feed
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{attacks.length} events</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRefresh}
              disabled={refreshing}
              className="h-7 w-7 p-0"
              title="Refresh threats"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleClear}
              disabled={clearing || attacks.length === 0}
              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
              title="Clear all threats"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto max-h-[360px] scrollbar-thin space-y-1 p-3">
          {attacks.length === 0 && (
            <p className="py-8 text-center text-xs text-muted-foreground">No attacks detected yet</p>
          )}
          {attacks.slice(0, 50).map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setSelected(a)}
              className="flex w-full items-center gap-3 rounded-md border border-transparent px-3 py-2 text-left transition-colors hover:border-border hover:bg-secondary/60"
            >
              <Badge tone={severityTone(a.severity)} className="shrink-0">
                {a.severity}
              </Badge>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-foreground">
                  {a.type}
                </p>
                <p className="truncate text-[10px] text-muted-foreground">
                  {a.sourceIp} → {a.targetEndpoint}
                </p>
              </div>
              <span className="shrink-0 text-[10px] text-muted-foreground font-mono-tabular">
                <LiveRelative ts={a.timestamp} />
              </span>
            </button>
          ))}
        </CardContent>
      </Card>

      <AlertDetailDrawer
        attack={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
