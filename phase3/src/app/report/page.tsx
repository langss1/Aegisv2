"use client";

import { useState, useEffect } from "react";
import { FileSearch, Download, RefreshCw, Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface ReportData {
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalAttacks: number;
    blockedAttacks: number;
    successfulAttacks: number;
    healingsApplied: number;
    cveAlerts: number;
  };
  attacks: {
    id: string;
    timestamp: string;
    attackType: string;
    severity: string;
    sourceIp: string;
    endpoint: string;
    blocked: boolean;
  }[];
  healings: {
    id: string;
    attackType: string;
    patch: string;
    status: string;
    appliedAt: number;
  }[];
}

export default function ReportPage() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hours, setHours] = useState(24);
  const [markdownContent, setMarkdownContent] = useState("");

  useEffect(() => {
    fetchReport();
  }, [hours]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      // Fetch JSON data
      const jsonRes = await fetch(`/api/report?format=json&hours=${hours}`);
      const jsonData = await jsonRes.json();
      if (jsonData.ok) {
        setReport(jsonData.data);
      }

      // Fetch markdown
      const mdRes = await fetch(`/api/report?hours=${hours}`);
      const md = await mdRes.text();
      setMarkdownContent(md);
    } catch (err) {
      console.error("Failed to fetch report:", err);
    }
    setLoading(false);
  };

  const downloadReport = () => {
    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AEGIS_Monitoring_Report_${new Date().toISOString().split("T")[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSecurityPosture = () => {
    if (!report) return { status: "Unknown", color: "gray" };
    if (report.summary.successfulAttacks === 0 && report.summary.totalAttacks > 0) {
      return { status: "SECURE", color: "green", description: "All attacks blocked" };
    }
    if (report.summary.successfulAttacks > 0) {
      return { status: "AT RISK", color: "red", description: "Some attacks succeeded" };
    }
    return { status: "MONITORING", color: "blue", description: "No attacks detected" };
  };

  const posture = getSecurityPosture();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FileSearch className="h-6 w-6 text-green-500" />
            Monitoring Report
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Security monitoring summary and statistics
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value={1}>Last 1 hour</option>
            <option value={6}>Last 6 hours</option>
            <option value={24}>Last 24 hours</option>
            <option value={168}>Last 7 days</option>
          </select>
          <button
            onClick={fetchReport}
            className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={downloadReport}
            className="flex items-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>
      </div>

      {/* Security Posture */}
      <div className={`rounded-lg border-2 p-6 ${
        posture.color === "green" ? "border-green-500 bg-green-500/10" :
        posture.color === "red" ? "border-red-500 bg-red-500/10" :
        "border-blue-500 bg-blue-500/10"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield className={`h-12 w-12 ${
              posture.color === "green" ? "text-green-500" :
              posture.color === "red" ? "text-red-500" :
              "text-blue-500"
            }`} />
            <div>
              <h2 className={`text-2xl font-bold ${
                posture.color === "green" ? "text-green-500" :
                posture.color === "red" ? "text-red-500" :
                "text-blue-500"
              }`}>
                {posture.status}
              </h2>
              <p className="text-sm text-muted-foreground">{posture.description}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Report Period</p>
            <p className="text-sm font-medium">
              {report ? new Date(report.period.start).toLocaleString() : "-"}
            </p>
            <p className="text-sm font-medium">
              to {report ? new Date(report.period.end).toLocaleString() : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {report && (
        <div className="grid grid-cols-5 gap-4">
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <AlertTriangle className="h-6 w-6 text-orange-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{report.summary.totalAttacks}</p>
            <p className="text-xs text-muted-foreground">Total Attacks</p>
          </div>
          <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-center">
            <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-green-500">{report.summary.blockedAttacks}</p>
            <p className="text-xs text-green-400">Blocked</p>
          </div>
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center">
            <AlertTriangle className="h-6 w-6 text-red-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-red-500">{report.summary.successfulAttacks}</p>
            <p className="text-xs text-red-400">Successful</p>
          </div>
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4 text-center">
            <Shield className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-blue-500">{report.summary.healingsApplied}</p>
            <p className="text-xs text-blue-400">Self-Healed</p>
          </div>
          <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-4 text-center">
            <Clock className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-purple-500">{report.summary.cveAlerts}</p>
            <p className="text-xs text-purple-400">CVE Alerts</p>
          </div>
        </div>
      )}

      {/* Recent Attacks */}
      {report && report.attacks.length > 0 && (
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold">Recent Attacks</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Time</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Severity</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Source IP</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Endpoint</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {report.attacks.slice(0, 10).map((attack) => (
                  <tr key={attack.id} className="hover:bg-muted/20">
                    <td className="px-4 py-2 text-xs text-muted-foreground">
                      {new Date(attack.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 font-medium">{attack.attackType}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-0.5 text-xs rounded ${
                        attack.severity === "Critical" ? "bg-red-500/20 text-red-400" :
                        attack.severity === "High" ? "bg-orange-500/20 text-orange-400" :
                        "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {attack.severity}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">{attack.sourceIp}</td>
                    <td className="px-4 py-2 text-xs">{attack.endpoint}</td>
                    <td className="px-4 py-2">
                      {attack.blocked ? (
                        <span className="flex items-center gap-1 text-green-500 text-xs">
                          <CheckCircle className="h-3 w-3" /> Blocked
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-500 text-xs">
                          <AlertTriangle className="h-3 w-3" /> Success
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Active Healings */}
      {report && report.healings.length > 0 && (
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold">Active Self-Healing Rules</h2>
          </div>
          <div className="divide-y divide-border">
            {report.healings.map((healing) => (
              <div key={healing.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">{healing.attackType}</p>
                  <p className="text-xs text-muted-foreground">{healing.patch}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs rounded ${
                    healing.status === "Applied" ? "bg-green-500/20 text-green-400" :
                    healing.status === "Approved" ? "bg-blue-500/20 text-blue-400" :
                    "bg-gray-500/20 text-gray-400"
                  }`}>
                    {healing.status}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(healing.appliedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {report && report.attacks.length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Activity</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            No attacks detected during this period. The system is monitoring for threats.
          </p>
        </div>
      )}
    </div>
  );
}
