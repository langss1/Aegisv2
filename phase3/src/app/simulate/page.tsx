"use client";

import { useState, useCallback, useRef } from "react";
import {
  Zap,
  Shield,
  Brain,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronRight,
  RotateCcw,
  Terminal,
  AlertTriangle,
  Flame,
  Target,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { bus } from "@/engine/eventBus";
import { nid } from "@/lib/id";
import type { AttackType, Severity } from "@/lib/types";

/* ── Types ───────────────────────────────────────────────────── */
type Step = "idle" | "detecting" | "analyzing" | "healing" | "done" | "error";

interface StepResult {
  label: string;
  status: "pending" | "running" | "ok" | "error";
  detail?: string;
  raw?: unknown;
}

interface SimResult {
  steps: StepResult[];
  attackInfo?: {
    type: string;
    severity: string;
    sourceIp: string;
    endpoint: string;
    payload: string;
  };
  error?: string;
}

/* ── Static data ─────────────────────────────────────────────── */
const ATTACK_CONFIGS: {
  index: number;
  type: AttackType;
  severity: Severity;
  icon: string;
  description: string;
  color: string;
}[] = [
  {
    index: 0,
    type: "SQL Injection",
    severity: "Critical",
    icon: "🗃️",
    description: "Exfiltrate and destroy database tables via malicious SQL",
    color: "border-red-500/60 bg-red-500/5",
  },
  {
    index: 1,
    type: "XSS",
    severity: "High",
    icon: "🔗",
    description: "Inject scripts to steal session cookies via search endpoint",
    color: "border-orange-500/60 bg-orange-500/5",
  },
  {
    index: 2,
    type: "RCE",
    severity: "Critical",
    icon: "💥",
    description: "Log4Shell-style JNDI payload via webhook handler",
    color: "border-red-600/60 bg-red-600/5",
  },
  {
    index: 3,
    type: "Command Injection",
    severity: "High",
    icon: "⚡",
    description: "Exfiltrate /etc/shadow via netcat reverse shell",
    color: "border-yellow-500/60 bg-yellow-500/5",
  },
  {
    index: 4,
    type: "Path Traversal",
    severity: "High",
    icon: "📂",
    description: "Read sensitive system files via directory traversal",
    color: "border-amber-500/60 bg-amber-500/5",
  },
];

const SEVERITY_COLORS: Record<Severity, string> = {
  Critical: "text-red-400 bg-red-400/10 border-red-400/30",
  High: "text-orange-400 bg-orange-400/10 border-orange-400/30",
  Medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  Low: "text-blue-400 bg-blue-400/10 border-blue-400/30",
};

/* ── Step icons ──────────────────────────────────────────────── */
function StepIcon({ status }: { status: StepResult["status"] }) {
  if (status === "running")
    return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
  if (status === "ok")
    return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
  if (status === "error")
    return <XCircle className="h-4 w-4 text-red-400" />;
  return <div className="h-4 w-4 rounded-full border border-border" />;
}

/* ── Main Component ──────────────────────────────────────────── */
export default function SimulatePage() {
  const [selected, setSelected] = useState<number>(0);
  const [step, setStep] = useState<Step>("idle");
  const [result, setResult] = useState<SimResult | null>(null);
  const [burstMode, setBurstMode] = useState(false);
  const [burstCount, setBurstCount] = useState(3);
  const [burstLog, setBurstLog] = useState<string[]>([]);
  const abortRef = useRef(false);

  /* Inject attack into live event bus for dashboard reactivity */
  function injectLiveAttack(attackType: string, severity: string, endpoint: string, payload: string) {
    const now = Date.now();
    const attack = {
      id: nid("atk"),
      type: attackType as AttackType,
      severity: severity as Severity,
      sourceIp: randomIp(),
      targetEndpoint: endpoint,
      method: "POST" as const,
      payloadSnippet: payload,
      timestamp: now,
      matchedRuleId: `WAF-${attackType.replace(/\s/g, "").slice(0, 3).toUpperCase()}-001`,
    };
    bus.emit("attack", attack);
    bus.emit("traffic-tick", {
      time: new Date(now).toLocaleTimeString(),
      ts: now,
      normal: Math.floor(Math.random() * 100) + 80,
      attack: Math.floor(Math.random() * 80) + 40,
    });
  }

  const runSimulation = useCallback(async () => {
    if (step === "detecting" || step === "analyzing" || step === "healing") return;
    abortRef.current = false;
    setStep("detecting");
    setBurstLog([]);

    const steps: StepResult[] = [
      { label: "Attack Detection & WAF Alert", status: "running" },
      { label: "Deepseek AI Threat Analysis", status: "pending" },
      { label: "Self-Healing + Telegram HITL", status: "pending" },
    ];
    setResult({ steps: [...steps] });

    try {
      /* ── Step 1: Call API ── */
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attackIndex: selected }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Simulation failed");
      }

      const attackInfo = data.results?.step1_attack?.attack;

      /* Inject live into event bus */
      if (attackInfo) {
        injectLiveAttack(
          attackInfo.type,
          attackInfo.severity,
          attackInfo.endpoint,
          attackInfo.payload
        );
      }

      /* Mark step 1 done */
      steps[0] = {
        label: "Attack Detection & WAF Alert",
        status: data.results?.step1_attack?.sent ? "ok" : "error",
        detail: data.results?.step1_attack?.sent
          ? `Telegram alert sent for ${attackInfo?.type} from ${attackInfo?.sourceIp}`
          : "Telegram alert failed",
        raw: data.results?.step1_attack,
      };
      steps[1] = { label: "Deepseek AI Threat Analysis", status: "running" };
      setStep("analyzing");
      setResult({ steps: [...steps], attackInfo });

      /* Slight delay so UI shows step 2 running */
      await delay(800);

      const aiAnalysis = data.results?.step2_ai_analysis;
      const aiOk = aiAnalysis && !aiAnalysis.error;
      steps[1] = {
        label: "Deepseek AI Threat Analysis",
        status: aiOk ? "ok" : "error",
        detail: aiOk
          ? `Threat: ${aiAnalysis.threat_level} | Confidence: ${aiAnalysis.confidence}% | FP: ${aiAnalysis.is_false_positive_likely ? "Likely" : "Unlikely"}`
          : `Error: ${aiAnalysis?.error ?? "Unknown"}`,
        raw: aiAnalysis,
      };
      steps[2] = { label: "Self-Healing + Telegram HITL", status: "running" };
      setStep("healing");
      setResult({ steps: [...steps], attackInfo });

      await delay(800);

      const healResult = data.results?.step3_healing_telegram;
      steps[2] = {
        label: "Self-Healing + Telegram HITL",
        status: healResult?.sent ? "ok" : "error",
        detail: healResult?.sent
          ? `Healing ID: ${healResult.healingId} — Approve/Revert buttons sent`
          : "Telegram healing message failed",
        raw: healResult,
      };

      setStep("done");
      setResult({ steps: [...steps], attackInfo });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setStep("error");
      setResult((prev) => ({
        steps:
          prev?.steps.map((s) =>
            s.status === "running" ? { ...s, status: "error", detail: errMsg } : s
          ) ?? [],
        error: errMsg,
      }));
    }
  }, [selected, step]);

  const runBurst = useCallback(async () => {
    if (step === "detecting" || step === "analyzing" || step === "healing") return;
    abortRef.current = false;
    setStep("detecting");
    setBurstLog([]);

    const log: string[] = [];

    for (let i = 0; i < burstCount; i++) {
      if (abortRef.current) break;
      const idx = i % ATTACK_CONFIGS.length;
      const attack = ATTACK_CONFIGS[idx];
      log.push(`[${timestamp()}] Launching ${attack.type} (${attack.severity})...`);
      setBurstLog([...log]);

      try {
        const res = await fetch("/api/simulate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ attackIndex: idx }),
        });
        const data = await res.json();
        const ok = res.ok && !data.error;

        /* Inject into dashboard */
        if (ok && data.results?.step1_attack?.attack) {
          const a = data.results.step1_attack.attack;
          injectLiveAttack(a.type, a.severity, a.endpoint, a.payload);
        }

        log.push(
          ok
            ? `[${timestamp()}] ✅ ${attack.type} — healed. ID: ${data.results?.step3_healing_telegram?.healingId ?? "?"}`
            : `[${timestamp()}] ❌ ${attack.type} — failed: ${data.error}`
        );
      } catch (err) {
        log.push(`[${timestamp()}] ❌ ${attack.type} — ${String(err)}`);
      }

      setBurstLog([...log]);
      if (i < burstCount - 1) await delay(1200);
    }

    log.push(`[${timestamp()}] 🏁 Burst complete. ${burstCount} attacks fired.`);
    setBurstLog([...log]);
    setStep("done");
  }, [burstCount, step]);

  const reset = () => {
    abortRef.current = true;
    setStep("idle");
    setResult(null);
    setBurstLog([]);
  };

  const isRunning = step === "detecting" || step === "analyzing" || step === "healing";
  const cfg = ATTACK_CONFIGS[selected];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Attack Simulator
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Fire real attack payloads against AEGIS — watch detection, AI analysis, and self-healing in action
          </p>
        </div>

        {(step === "done" || step === "error") && (
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded-md px-3 py-1.5 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* ── Left panel: Config ───────────────────────────── */}
        <div className="xl:col-span-1 space-y-4">
          {/* Mode toggle */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Mode
            </p>
            <div className="flex gap-2">
              <button
                id="mode-single"
                onClick={() => setBurstMode(false)}
                className={cn(
                  "flex-1 rounded-md border px-3 py-2 text-xs font-medium transition-colors",
                  !burstMode
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                <Target className="h-3.5 w-3.5 inline mr-1" />
                Single
              </button>
              <button
                id="mode-burst"
                onClick={() => setBurstMode(true)}
                className={cn(
                  "flex-1 rounded-md border px-3 py-2 text-xs font-medium transition-colors",
                  burstMode
                    ? "border-red-500 bg-red-500/10 text-red-400"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                <Flame className="h-3.5 w-3.5 inline mr-1" />
                Burst
              </button>
            </div>

            {burstMode && (
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">
                  Attack Count: <span className="text-foreground font-medium">{burstCount}</span>
                </label>
                <input
                  type="range"
                  min={2}
                  max={10}
                  value={burstCount}
                  onChange={(e) => setBurstCount(Number(e.target.value))}
                  className="w-full accent-red-500"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>2</span><span>10</span>
                </div>
              </div>
            )}
          </div>

          {/* Attack type selector (only for single mode) */}
          {!burstMode && (
            <div className="rounded-lg border border-border bg-card p-4 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Attack Type
              </p>
              <div className="space-y-2">
                {ATTACK_CONFIGS.map((atk) => (
                  <button
                    key={atk.index}
                    id={`attack-type-${atk.index}`}
                    onClick={() => setSelected(atk.index)}
                    className={cn(
                      "w-full text-left rounded-md border px-3 py-2.5 transition-all text-xs",
                      selected === atk.index
                        ? atk.color + " border-opacity-100"
                        : "border-border hover:bg-secondary"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">
                        {atk.icon} {atk.type}
                      </span>
                      <span
                        className={cn(
                          "rounded border px-1.5 py-0.5 text-[10px] font-semibold",
                          SEVERITY_COLORS[atk.severity]
                        )}
                      >
                        {atk.severity}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-1 leading-relaxed">
                      {atk.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Launch button */}
          <button
            id="btn-launch-attack"
            onClick={burstMode ? runBurst : runSimulation}
            disabled={isRunning}
            className={cn(
              "w-full flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-all",
              isRunning
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : burstMode
                ? "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/40"
                : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40"
            )}
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {step === "detecting" && "Detecting..."}
                {step === "analyzing" && "Analyzing with AI..."}
                {step === "healing" && "Healing..."}
              </>
            ) : (
              <>
                {burstMode ? <Flame className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                {burstMode ? `Fire ${burstCount} Attacks` : "Launch Attack"}
              </>
            )}
          </button>

          {/* Requirements note */}
          <div className="rounded-md border border-border bg-muted/40 px-3 py-2.5 text-[10px] text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground text-xs">Requirements</p>
            <p>• <code>TELEGRAM_CHAT_ID</code> must be set</p>
            <p>• <code>DEEPSEEK_API_KEY</code> must be set</p>
            <p>• Bot must be running (<code>GET /api/telegram/setup</code>)</p>
          </div>
        </div>

        {/* ── Right panel: Results ─────────────────────────── */}
        <div className="xl:col-span-2 space-y-4">
          {/* Single mode results */}
          {!burstMode && (
            <>
              {/* Pipeline steps */}
              <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5" /> Execution Pipeline
                </p>

                {step === "idle" && !result && (
                  <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
                    <Shield className="h-10 w-10 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">
                      Select an attack type and click <span className="text-primary font-medium">Launch Attack</span>
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                      The simulation will trigger detection → AI analysis → self-healing via Telegram
                    </p>
                  </div>
                )}

                {result && (
                  <div className="space-y-2">
                    {result.steps.map((s, i) => {
                      const icons = [
                        <AlertTriangle key="alert" className="h-4 w-4 text-muted-foreground" />,
                        <Brain key="brain" className="h-4 w-4 text-muted-foreground" />,
                        <Shield key="shield" className="h-4 w-4 text-muted-foreground" />,
                      ];
                      return (
                        <div
                          key={i}
                          className={cn(
                            "rounded-md border px-4 py-3 transition-all",
                            s.status === "running"
                              ? "border-primary/40 bg-primary/5"
                              : s.status === "ok"
                              ? "border-emerald-500/30 bg-emerald-500/5"
                              : s.status === "error"
                              ? "border-red-500/30 bg-red-500/5"
                              : "border-border"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <StepIcon status={s.status} />
                            <div className="flex items-center gap-2 flex-1">
                              {icons[i]}
                              <span className="text-xs font-medium text-foreground">{s.label}</span>
                            </div>
                            <span
                              className={cn(
                                "text-[10px] font-semibold uppercase",
                                s.status === "running" && "text-primary",
                                s.status === "ok" && "text-emerald-400",
                                s.status === "error" && "text-red-400",
                                s.status === "pending" && "text-muted-foreground"
                              )}
                            >
                              {s.status}
                            </span>
                          </div>
                          {s.detail && (
                            <p className="mt-2 text-[11px] text-muted-foreground pl-7">
                              <ChevronRight className="h-3 w-3 inline -mt-0.5" /> {s.detail}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Attack info card */}
              {result?.attackInfo && (
                <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Attack Details
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {[
                      { label: "Type", value: result.attackInfo.type },
                      {
                        label: "Severity",
                        value: result.attackInfo.severity,
                        cls: SEVERITY_COLORS[result.attackInfo.severity as Severity],
                      },
                      { label: "Source IP", value: result.attackInfo.sourceIp, mono: true },
                      { label: "Endpoint", value: result.attackInfo.endpoint, mono: true },
                    ].map(({ label, value, cls, mono }) => (
                      <div key={label} className="rounded-md border border-border bg-muted/30 px-3 py-2">
                        <p className="text-muted-foreground text-[10px] uppercase tracking-wide mb-1">{label}</p>
                        <p className={cn("font-medium", cls ?? "text-foreground", mono && "font-mono")}>
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
                    <p className="text-muted-foreground text-[10px] uppercase tracking-wide mb-1">Payload</p>
                    <code className="text-[11px] text-red-400 break-all">{result.attackInfo.payload}</code>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Burst mode terminal */}
          {burstMode && (
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2">
                <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  AEGIS Burst Terminal
                </span>
                {isRunning && (
                  <span className="ml-auto flex items-center gap-1 text-[10px] text-red-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                    FIRING
                  </span>
                )}
                {step === "done" && burstLog.length > 0 && (
                  <span className="ml-auto text-[10px] text-emerald-400">COMPLETE</span>
                )}
              </div>
              <div className="min-h-[300px] max-h-[400px] overflow-y-auto p-4 font-mono text-[11px] space-y-1 bg-black/40">
                {burstLog.length === 0 && step === "idle" && (
                  <p className="text-muted-foreground">
                    {`>`} Ready. Press <span className="text-red-400">Fire {burstCount} Attacks</span> to begin burst simulation.
                  </p>
                )}
                {burstLog.map((line, i) => (
                  <p
                    key={i}
                    className={cn(
                      "leading-relaxed",
                      line.includes("✅") ? "text-emerald-400" : line.includes("❌") ? "text-red-400" : line.includes("🏁") ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {line}
                  </p>
                ))}
                {isRunning && (
                  <p className="text-primary animate-pulse">{`>`} _</p>
                )}
              </div>
            </div>
          )}

          {/* Error banner */}
          {step === "error" && result?.error && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/5 px-4 py-3 flex items-start gap-3">
              <XCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-red-400">Simulation Error</p>
                <p className="text-xs text-muted-foreground mt-1">{result.error}</p>
                <p className="text-[10px] text-muted-foreground mt-2">
                  Check that your <code>TELEGRAM_CHAT_ID</code> and <code>DEEPSEEK_API_KEY</code> environment variables are set correctly.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────── */
function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function randomIp() {
  return `${r(1, 223)}.${r(0, 255)}.${r(0, 255)}.${r(1, 254)}`;
}
function r(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function timestamp() {
  return new Date().toLocaleTimeString();
}
