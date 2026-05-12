"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, RotateCcw, Clock, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge, severityTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useHealingStore } from "@/store/healingStore";
import { formatRelative, formatCountdown } from "@/lib/format";
import { ReverseConfirm } from "./ReverseConfirm";
import type { HealingAction, HealingStatus } from "@/lib/types";

// Live countdown component that updates every second
function LiveCountdown({ targetTs }: { targetTs: number }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <>{formatCountdown(targetTs, now)}</>;
}

// Live relative time component that updates every second
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

export function HealingActionsList({ filter }: { filter: HealingStatus }) {
  const actions = useHealingStore((s) => s.actions);
  const approveAction = useHealingStore((s) => s.approveAction);
  const [reverseTarget, setReverseTarget] = useState<HealingAction | null>(null);

  const filtered = actions.filter((a) => a.status === filter);

  if (filtered.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No {filter.toLowerCase()} actions
      </p>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {filtered.map((a) => (
          <Card key={a.id} className="transition-colors hover:border-primary/30">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-md bg-secondary p-2 text-success">
                {a.status === "Approved" ? <Lock className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground">{a.patch}</p>
                <p className="text-[10px] text-muted-foreground">
                  {a.attackType} &middot; <Badge tone={severityTone(a.severity)} className="inline">{a.severity}</Badge>
                  {a.targetEndpoint && <span> &middot; {a.targetEndpoint}</span>}
                </p>
                <p className="text-[10px] text-muted-foreground/60">
                  Applied <LiveRelative ts={a.appliedAt} />
                  {a.sourceIp && <span> &middot; from {a.sourceIp}</span>}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {a.status === "Applied" && (
                  <>
                    <span className="flex flex-col items-end text-[10px] text-muted-foreground font-mono-tabular" title="Time remaining to reverse this patch">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <LiveCountdown targetTs={a.reverseDeadline} />
                      </span>
                      <span className="text-[9px] text-muted-foreground/50">reverse window</span>
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-success hover:text-success hover:bg-success/10"
                      onClick={() => approveAction(a.id, "Operator (Dashboard)")}
                    >
                      <Lock className="h-3 w-3" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setReverseTarget(a)}
                    >
                      <RotateCcw className="h-3 w-3" />
                      Reverse
                    </Button>
                  </>
                )}
                {a.status === "Approved" && (
                  <Badge tone="success">Locked <LiveRelative ts={a.approvedAt!} /></Badge>
                )}
                {a.status === "Reversed" && (
                  <Badge tone="warning">Reversed <LiveRelative ts={a.reversedAt!} /></Badge>
                )}
                {a.status === "Expired" && (
                  <Badge tone="secondary">Expired</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ReverseConfirm
        action={reverseTarget}
        onClose={() => setReverseTarget(null)}
      />
    </>
  );
}
