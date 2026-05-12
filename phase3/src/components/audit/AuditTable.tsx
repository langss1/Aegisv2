"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAuditStore } from "@/store/auditStore";
import { formatDateTime } from "@/lib/format";
import type { AuditAction } from "@/lib/types";

const ACTION_TONE: Record<AuditAction, "default" | "destructive" | "warning" | "info" | "success"> = {
  "apply-patch": "success",
  "approve-patch": "info",
  "reverse-patch": "warning",
  "edit-rule": "info",
  "ack-alert": "default",
  "policy-trigger": "success",
};

export function AuditTable() {
  const entries = useAuditStore((s) => s.entries);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Audit Trail</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto max-h-[calc(100vh-240px)] scrollbar-thin p-0">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-card border-b border-border">
            <tr className="text-left text-muted-foreground">
              <th className="px-4 py-2 font-medium">Time</th>
              <th className="px-4 py-2 font-medium">Actor</th>
              <th className="px-4 py-2 font-medium">Action</th>
              <th className="px-4 py-2 font-medium">Reference</th>
              <th className="px-4 py-2 font-medium">Note</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-muted-foreground">
                  No audit entries yet
                </td>
              </tr>
            )}
            {entries.map((e) => (
              <tr key={e.id} className="border-b border-border/50 hover:bg-secondary/40">
                <td className="whitespace-nowrap px-4 py-2 font-mono-tabular text-muted-foreground">
                  {formatDateTime(e.ts)}
                </td>
                <td className="px-4 py-2">
                  <span className={e.actor === "system" ? "text-blue-400" : "text-foreground"}>
                    {e.actorName}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <Badge tone={ACTION_TONE[e.action]}>{e.action}</Badge>
                </td>
                <td className="max-w-[200px] truncate px-4 py-2 text-muted-foreground">
                  {e.refLabel}
                </td>
                <td className="max-w-[200px] truncate px-4 py-2 text-muted-foreground">
                  {e.note ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
