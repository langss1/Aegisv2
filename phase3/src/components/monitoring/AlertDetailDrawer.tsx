"use client";

import { useState, useEffect } from "react";
import { BrainCircuit, Loader2 } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Badge, severityTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/format";
import { analyzeWithAI } from "@/lib/apiClient";
import type { AttackEvent } from "@/lib/types";

interface AIAnalysis {
  threat_level: string;
  analysis: string;
  recommendation: string;
  is_false_positive_likely: boolean;
  confidence: number;
}

export function AlertDetailDrawer({
  attack,
  onClose,
}: {
  attack: AttackEvent | null;
  onClose: () => void;
}) {
  const [aiResult, setAiResult] = useState<AIAnalysis | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    setAiResult(null);
    setAiError(null);
  }, [attack?.id]);

  const handleAnalyze = async () => {
    if (!attack) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await analyzeWithAI({
        type: attack.type,
        severity: attack.severity,
        payloadSnippet: attack.payloadSnippet,
        targetEndpoint: attack.targetEndpoint,
        method: attack.method,
        sourceIp: attack.sourceIp,
      });
      if (res.ok) {
        setAiResult(res.analysis);
      } else {
        setAiError(res.error || "Analysis failed");
      }
    } catch (err) {
      setAiError(String(err));
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <Drawer
      open={!!attack}
      onClose={onClose}
      title={attack?.type ?? ""}
      description="Attack Details"
    >
      {attack && (
        <div className="space-y-4">
          <section className="space-y-2">
            <Row label="Severity">
              <Badge tone={severityTone(attack.severity)}>{attack.severity}</Badge>
            </Row>
            <Row label="Timestamp">{formatDateTime(attack.timestamp)}</Row>
            <Row label="Source IP">
              <span className="font-mono-tabular text-xs">{attack.sourceIp}</span>
            </Row>
            {attack.geo && (
              <Row label="Geo">
                {attack.geo.city ? `${attack.geo.city}, ` : ""}
                {attack.geo.country}
              </Row>
            )}
            <Row label="Target">
              <span className="font-mono-tabular text-xs">{attack.method} {attack.targetEndpoint}</span>
            </Row>
            {attack.matchedRuleId && (
              <Row label="WAF Rule">
                <Badge tone="outline">{attack.matchedRuleId}</Badge>
              </Row>
            )}
          </section>

          <section>
            <h4 className="mb-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Payload Snippet
            </h4>
            <pre className="rounded-md border border-border bg-background p-3 text-[11px] text-destructive font-mono-tabular overflow-x-auto whitespace-pre-wrap break-all">
              {attack.payloadSnippet}
            </pre>
          </section>

          <section className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <BrainCircuit className="h-3.5 w-3.5" />
                AI Analysis (Deepseek)
              </h4>
              {!aiResult && (
                <Button variant="outline" size="sm" onClick={handleAnalyze} disabled={aiLoading}>
                  {aiLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <BrainCircuit className="h-3 w-3" />}
                  {aiLoading ? "Analyzing..." : "Analyze"}
                </Button>
              )}
            </div>

            {aiError && (
              <p className="text-[11px] text-destructive bg-destructive/10 border border-destructive/30 rounded p-2">
                {aiError}
              </p>
            )}

            {aiResult && (
              <div className="space-y-2 rounded-md border border-border bg-background p-3 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Threat Level</span>
                  <Badge tone={severityTone(aiResult.threat_level === "critical" ? "Critical" : aiResult.threat_level === "high" ? "High" : aiResult.threat_level === "medium" ? "Medium" : "Low")}>
                    {aiResult.threat_level}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-mono-tabular font-medium">{aiResult.confidence}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">False Positive?</span>
                  <Badge tone={aiResult.is_false_positive_likely ? "warning" : "success"}>
                    {aiResult.is_false_positive_likely ? "Likely" : "Unlikely"}
                  </Badge>
                </div>
                <div className="pt-1 border-t border-border">
                  <p className="text-muted-foreground mb-0.5 font-medium">Analysis</p>
                  <p className="text-foreground">{aiResult.analysis}</p>
                </div>
                <div className="pt-1 border-t border-border">
                  <p className="text-muted-foreground mb-0.5 font-medium">Recommendation</p>
                  <p className="text-foreground">{aiResult.recommendation}</p>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </Drawer>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <div className="text-right text-xs text-foreground">{children}</div>
    </div>
  );
}
