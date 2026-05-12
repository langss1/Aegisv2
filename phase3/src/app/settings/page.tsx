"use client";

import { useSettingsStore } from "@/store/settingsStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RotateCcw } from "lucide-react";

export default function SettingsPage() {
  const policies = useSettingsStore((s) => s.policies);
  const togglePolicy = useSettingsStore((s) => s.togglePolicy);
  const resetPolicies = useSettingsStore((s) => s.resetPolicies);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Settings</h1>
          <p className="text-xs text-muted-foreground">
            Configure self-healing policies and alert rules
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={resetPolicies}>
          <RotateCcw className="h-3 w-3" />
          Reset Defaults
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Healing Policies</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-xs">
            <thead className="border-b border-border bg-secondary/30">
              <tr className="text-left text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Attack Type</th>
                <th className="px-4 py-2.5 font-medium">Min Severity</th>
                <th className="px-4 py-2.5 font-medium">Patch Name</th>
                <th className="px-4 py-2.5 font-medium">WAF Rule</th>
                <th className="px-4 py-2.5 font-medium text-center">Enabled</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((p) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/40">
                  <td className="px-4 py-2.5 font-medium text-foreground">{p.attackType}</td>
                  <td className="px-4 py-2.5">
                    <Badge tone="outline">{p.minSeverity}</Badge>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{p.patchName}</td>
                  <td className="px-4 py-2.5 font-mono-tabular text-muted-foreground">{p.wafRuleId}</td>
                  <td className="px-4 py-2.5 text-center">
                    <button
                      type="button"
                      onClick={() => togglePolicy(p.id)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        p.enabled ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                          p.enabled ? "translate-x-[18px]" : "translate-x-[3px]"
                        }`}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
