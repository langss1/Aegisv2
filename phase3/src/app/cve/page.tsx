"use client";

import { useState, useEffect } from "react";
import { Bug, Search, RefreshCw, ExternalLink, AlertTriangle, CheckCircle } from "lucide-react";

interface CVEFinding {
  id: string;
  description: string;
  severity: string;
  cvssScore: number;
  affectedProduct: string;
  publishedDate: string;
  references: string[];
  recommendation?: string;
}

interface CVEStatus {
  lastScan: string | null;
  isScanning: boolean;
  findings: CVEFinding[];
  summary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export default function CVEPage() {
  const [status, setStatus] = useState<CVEStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/cve");
      const data = await res.json();
      if (data.ok) {
        setStatus(data);
      }
    } catch (err) {
      console.error("Failed to fetch CVE status:", err);
    }
    setLoading(false);
  };

  const runScan = async () => {
    if (!searchKeyword) {
      alert("Please enter a keyword to search (e.g., express, lodash, react)");
      return;
    }

    setScanning(true);
    try {
      const res = await fetch("/api/cve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "scan", keyword: searchKeyword }),
      });
      const data = await res.json();
      if (data.ok) {
        await fetchStatus();
      }
    } catch (err) {
      console.error("Scan failed:", err);
    }
    setScanning(false);
  };

  const dismissCVE = async (cveId: string) => {
    try {
      await fetch("/api/cve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "dismiss", cveId }),
      });
      await fetchStatus();
    } catch (err) {
      console.error("Dismiss failed:", err);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "text-red-500 bg-red-500/10 border-red-500/30";
      case "HIGH":
        return "text-orange-500 bg-orange-500/10 border-orange-500/30";
      case "MEDIUM":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30";
      case "LOW":
        return "text-blue-500 bg-blue-500/10 border-blue-500/30";
      default:
        return "text-gray-500 bg-gray-500/10 border-gray-500/30";
    }
  };

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
            <Bug className="h-6 w-6 text-green-500" />
            CVE Monitor
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor National Vulnerability Database for new CVEs affecting your dependencies
          </p>
        </div>
        <button
          onClick={fetchStatus}
          className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-semibold mb-3">CVE Search</h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter package name to search (e.g., express, lodash, axios)"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={scanning}
          />
          <button
            onClick={runScan}
            disabled={scanning || !searchKeyword}
            className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {scanning ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Search CVEs
              </>
            )}
          </button>
        </div>
        {status?.lastScan && (
          <p className="text-xs text-muted-foreground mt-2">
            Last scan: {new Date(status.lastScan).toLocaleString()}
          </p>
        )}
      </div>

      {/* Summary */}
      {status && (
        <div className="grid grid-cols-5 gap-3">
          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{status.summary.total}</p>
            <p className="text-xs text-muted-foreground">Total CVEs</p>
          </div>
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center">
            <p className="text-2xl font-bold text-red-500">{status.summary.critical}</p>
            <p className="text-xs text-red-400">Critical</p>
          </div>
          <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-3 text-center">
            <p className="text-2xl font-bold text-orange-500">{status.summary.high}</p>
            <p className="text-xs text-orange-400">High</p>
          </div>
          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-center">
            <p className="text-2xl font-bold text-yellow-500">{status.summary.medium}</p>
            <p className="text-xs text-yellow-400">Medium</p>
          </div>
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 text-center">
            <p className="text-2xl font-bold text-blue-500">{status.summary.low}</p>
            <p className="text-xs text-blue-400">Low</p>
          </div>
        </div>
      )}

      {/* CVE List */}
      {status && status.findings.length > 0 ? (
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              CVE Findings ({status.findings.length})
            </h2>
          </div>
          <div className="divide-y divide-border">
            {status.findings.map((cve) => (
              <div key={cve.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-foreground flex items-center gap-2">
                      {cve.id}
                      <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getSeverityColor(cve.severity)}`}>
                        {cve.severity}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        CVSS: {cve.cvssScore}
                      </span>
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Affects: {cve.affectedProduct} | Published: {new Date(cve.publishedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => dismissCVE(cve.id)}
                    className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded border border-border hover:bg-muted"
                  >
                    Dismiss
                  </button>
                </div>
                <p className="text-sm text-foreground mt-2 line-clamp-2">{cve.description}</p>
                {cve.references.length > 0 && (
                  <div className="mt-2 flex gap-2">
                    <a
                      href={cve.references[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Details
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No CVEs Found</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            No critical or high severity CVEs detected. Search for a package name to check for vulnerabilities.
          </p>
        </div>
      )}
    </div>
  );
}
