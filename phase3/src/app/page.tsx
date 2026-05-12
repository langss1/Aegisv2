"use client";

import Link from "next/link";
import { Shield, Crosshair, Eye, ArrowRight, Zap, Bug, FileText, ShieldCheck } from "lucide-react";

export default function RootPage() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">AEGIS</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          AI-Enhanced Guardian for Intelligent Security
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Automated Penetration Testing & Real-time Defense Platform
        </p>
      </div>

      {/* Phase Cards */}
      <div className="grid grid-cols-2 gap-6">
        {/* Phase 2 */}
        <div className="rounded-xl border-2 border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-transparent p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-orange-500/20">
              <Crosshair className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Phase 2</h2>
              <p className="text-sm text-orange-400">AI Penetration Testing</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            AI-powered security scanner that automatically tests your application for OWASP Top 10 vulnerabilities via public ngrok URL.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-orange-500" />
              <span>OWASP Top 10 automated testing</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-orange-500" />
              <span>DeepSeek AI payload generation</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-orange-500" />
              <span>HITL notification via Telegram</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-orange-500" />
              <span>Auto-trigger self-healing</span>
            </li>
          </ul>
          <div className="flex gap-3">
            <Link
              href="/pentest"
              className="flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
            >
              Start Pentest
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pentest/report"
              className="flex items-center gap-2 rounded-md border border-orange-500/50 px-4 py-2 text-sm font-medium text-orange-400 hover:bg-orange-500/10"
            >
              <FileText className="h-4 w-4" />
              View Report
            </Link>
          </div>
        </div>

        {/* Phase 3 */}
        <div className="rounded-xl border-2 border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-green-500/20">
              <Eye className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Phase 3</h2>
              <p className="text-sm text-green-400">Defend & Monitor</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Real-time monitoring and self-healing platform that detects attacks, applies WAF rules, and monitors for new CVE vulnerabilities.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center gap-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              <span>Live attack detection & blocking</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              <span>AI-powered self-healing WAF</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              <span>CVE monitoring & auto-update</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              <span>HITL approve/reverse via Telegram</span>
            </li>
          </ul>
          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Open Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/cve"
              className="flex items-center gap-2 rounded-md border border-green-500/50 px-4 py-2 text-sm font-medium text-green-400 hover:bg-green-500/10"
            >
              <Bug className="h-4 w-4" />
              CVE Monitor
            </Link>
          </div>
        </div>
      </div>

      {/* Flow Diagram */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold mb-4 text-center">Security Flow</h3>
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
            <Crosshair className="h-8 w-8 text-orange-500" />
            <span className="font-medium">Phase 2</span>
            <span className="text-xs text-muted-foreground">AI Pentest</span>
          </div>
          <ArrowRight className="h-6 w-6 text-muted-foreground" />
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50">
            <span className="text-2xl">🔔</span>
            <span className="font-medium">HITL</span>
            <span className="text-xs text-muted-foreground">Telegram</span>
          </div>
          <ArrowRight className="h-6 w-6 text-muted-foreground" />
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <ShieldCheck className="h-8 w-8 text-blue-500" />
            <span className="font-medium">Self-Heal</span>
            <span className="text-xs text-muted-foreground">WAF Rules</span>
          </div>
          <ArrowRight className="h-6 w-6 text-muted-foreground" />
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
            <Eye className="h-8 w-8 text-green-500" />
            <span className="font-medium">Phase 3</span>
            <span className="text-xs text-muted-foreground">Defend</span>
          </div>
          <ArrowRight className="h-6 w-6 text-muted-foreground" />
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <Bug className="h-8 w-8 text-purple-500" />
            <span className="font-medium">CVE Watch</span>
            <span className="text-xs text-muted-foreground">Auto-Update</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Link href="/healing" className="rounded-lg border border-border bg-card p-4 hover:bg-muted/50 transition-colors">
          <p className="text-xs text-muted-foreground mb-1">Active WAF Rules</p>
          <p className="text-2xl font-bold text-foreground">-</p>
        </Link>
        <Link href="/alerts" className="rounded-lg border border-border bg-card p-4 hover:bg-muted/50 transition-colors">
          <p className="text-xs text-muted-foreground mb-1">Attacks Today</p>
          <p className="text-2xl font-bold text-foreground">-</p>
        </Link>
        <Link href="/cve" className="rounded-lg border border-border bg-card p-4 hover:bg-muted/50 transition-colors">
          <p className="text-xs text-muted-foreground mb-1">CVE Alerts</p>
          <p className="text-2xl font-bold text-foreground">-</p>
        </Link>
        <Link href="/report" className="rounded-lg border border-border bg-card p-4 hover:bg-muted/50 transition-colors">
          <p className="text-xs text-muted-foreground mb-1">Security Status</p>
          <p className="text-lg font-bold text-green-500">Monitoring</p>
        </Link>
      </div>
    </div>
  );
}
