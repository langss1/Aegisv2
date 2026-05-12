"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { 
  Code2, 
  Globe, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2,
  ExternalLink,
  FolderOpen,
  Sparkles
} from "lucide-react";

interface Vulnerability {
  type: string;
  severity: string;
  line: number;
  code: string;
  description: string;
}

interface Fix {
  type: string;
  line: number;
  original: string;
  fixed: string;
  explanation: string;
}

interface CodeData {
  config: {
    ngrokUrl: string;
    localPath: string;
  };
  file: {
    name: string;
    path: string;
    lines: number;
    content: string;
  };
  analysis: {
    vulnerabilities: Vulnerability[];
    fixes: Fix[];
    aiAnalysis: string;
    language: string;
  };
  availableFiles: string[];
}

export function LiveCodeMonitor() {
  const [data, setData] = useState<CodeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [ngrokUrl, setNgrokUrl] = useState("");
  const [localPath, setLocalPath] = useState("");
  const [selectedFile, setSelectedFile] = useState("server.js");
  const [showDiff, setShowDiff] = useState<number | null>(null);
  const [error, setError] = useState("");

  const fetchCode = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/code?file=${selectedFile}`);
      const json = await res.json();
      if (json.ok) {
        setData(json);
        setNgrokUrl(json.config.ngrokUrl || "");
        setLocalPath(json.config.localPath || "");
      } else {
        setError(json.error || "Failed to load");
      }
    } catch (err) {
      setError(String(err));
    }
    setLoading(false);
  }, [selectedFile]);

  useEffect(() => {
    fetchCode();
  }, [fetchCode]);

  const updateConfig = async () => {
    try {
      const res = await fetch("/api/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ngrokUrl, localPath }),
      });
      const json = await res.json();
      if (json.ok) {
        fetchCode();
      } else {
        setError(json.error);
      }
    } catch (err) {
      setError(String(err));
    }
  };

  const reanalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reanalyze: true }),
      });
      await res.json();
      await fetchCode();
    } catch (err) {
      setError(String(err));
    }
    setAnalyzing(false);
  };

  const applyFix = async (fix: Fix) => {
    setLoading(true);
    try {
      const res = await fetch("/api/code/fix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          file: selectedFile,
          fix: fix 
        }),
      });
      const json = await res.json();
      if (json.ok) {
        setShowDiff(null);
        await fetchCode();
        // Re-analyze to update vulnerability list
        await reanalyze();
      } else {
        setError(json.error || "Failed to apply fix");
      }
    } catch (err) {
      setError(String(err));
    }
    setLoading(false);
  };

  const applyAllFixes = async () => {
    if (!data || data.analysis.fixes.length === 0) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/autofix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          targetPath: localPath,
          dryRun: false 
        }),
      });
      const json = await res.json();
      if (json.ok) {
        setShowDiff(null);
        await fetchCode();
        // Re-analyze to see clean code
        await reanalyze();
      } else {
        setError(json.error || "Failed to apply fixes");
      }
    } catch (err) {
      setError(String(err));
    }
    setLoading(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      default: return "bg-blue-500/20 text-blue-400 border-blue-500/50";
    }
  };

  const getVulnLines = () => {
    if (!data) return new Set<number>();
    return new Set(data.analysis.vulnerabilities.map(v => v.line));
  };

  const getFixForLine = (line: number): Fix | undefined => {
    if (!data) return undefined;
    return data.analysis.fixes.find(f => f.line === line);
  };

  const vulnLines = getVulnLines();

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Code2 className="h-4 w-4 text-primary" />
            Live Code Monitor
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={fetchCode}
              disabled={loading}
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              size="sm" 
              variant="default"
              onClick={reanalyze}
              disabled={analyzing}
            >
              <Sparkles className={`h-3 w-3 mr-1 ${analyzing ? 'animate-pulse' : ''}`} />
              {analyzing ? "Analyzing..." : "AI Analyze"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Config Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground flex items-center gap-1">
              <Globe className="h-3 w-3" /> Live URL (ngrok)
            </label>
            <div className="flex gap-2">
              <Input
                value={ngrokUrl}
                onChange={(e) => setNgrokUrl(e.target.value)}
                placeholder="https://xxxx.ngrok-free.dev"
                className="h-8 text-xs"
              />
              {ngrokUrl && (
                <a 
                  href={ngrokUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-transparent hover:bg-secondary text-foreground"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground flex items-center gap-1">
              <FolderOpen className="h-3 w-3" /> Local Path
            </label>
            <div className="flex gap-2">
              <Input
                value={localPath}
                onChange={(e) => setLocalPath(e.target.value)}
                placeholder="D:/path/to/vulnerable-app"
                className="h-8 text-xs"
              />
              <Button size="sm" variant="outline" onClick={updateConfig}>
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* File Selector */}
        {data?.availableFiles && data.availableFiles.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {data.availableFiles.map((file) => (
              <Button
                key={file}
                size="sm"
                variant={selectedFile === file ? "default" : "outline"}
                onClick={() => setSelectedFile(file)}
                className="text-xs h-7"
              >
                {file}
              </Button>
            ))}
          </div>
        )}

        {error && (
          <div className="text-xs text-red-400 bg-red-500/10 p-2 rounded">
            {error}
          </div>
        )}

        {/* AI Analysis Summary */}
        {data?.analysis.aiAnalysis && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-primary">DeepSeek AI Analysis</span>
            </div>
            <p className="text-xs text-muted-foreground">{data.analysis.aiAnalysis}</p>
          </div>
        )}

        {/* Vulnerabilities Summary */}
        {data?.analysis.vulnerabilities && data.analysis.vulnerabilities.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-muted-foreground">
                Found {data.analysis.vulnerabilities.length} vulnerabilities:
              </div>
              {data.analysis.fixes.length > 0 && (
                <Button
                  size="sm"
                  variant="default"
                  className="h-7 px-3 text-xs bg-green-600 hover:bg-green-700"
                  onClick={applyAllFixes}
                  disabled={loading}
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Apply All {data.analysis.fixes.length} Fixes
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {data.analysis.vulnerabilities.map((vuln, idx) => (
                <Badge 
                  key={idx} 
                  tone="outline"
                  className={`text-xs cursor-pointer ${getSeverityColor(vuln.severity)}`}
                  onClick={() => {
                    const el = document.getElementById(`line-${vuln.line}`);
                    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                >
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {vuln.type} (L{vuln.line})
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Code Viewer */}
        {data?.file.content && (
          <div className="relative">
            <div className="absolute top-2 right-2 z-10">
              <Badge tone="secondary" className="text-xs">
                {data.file.name} • {data.file.lines} lines
              </Badge>
            </div>
            <div className="bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden">
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <pre className="text-xs p-4">
                  <code>
                    {data.file.content.split("\n").map((line, idx) => {
                      const lineNum = idx + 1;
                      const isVuln = vulnLines.has(lineNum);
                      const fix = getFixForLine(lineNum);
                      const vuln = data.analysis.vulnerabilities.find(v => v.line === lineNum);
                      
                      return (
                        <div key={idx} id={`line-${lineNum}`} className="group">
                          <div 
                            className={`flex hover:bg-zinc-800/50 ${
                              isVuln ? 'bg-red-500/10 border-l-2 border-red-500' : ''
                            }`}
                          >
                            <span className="select-none text-zinc-600 w-12 text-right pr-4 flex-shrink-0">
                              {lineNum}
                            </span>
                            <span className={`flex-1 ${isVuln ? 'text-red-300' : 'text-zinc-300'}`}>
                              {line || " "}
                            </span>
                            {isVuln && fix && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-5 px-2 text-xs opacity-0 group-hover:opacity-100 text-green-400"
                                onClick={() => setShowDiff(showDiff === lineNum ? null : lineNum)}
                              >
                                {showDiff === lineNum ? "Hide Fix" : "Show Fix"}
                              </Button>
                            )}
                          </div>
                          
                          {/* Vulnerability Info */}
                          {isVuln && vuln && (
                            <div className="bg-red-500/5 border-l-2 border-red-500 pl-12 pr-4 py-1">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="h-3 w-3 text-red-400" />
                                <span className="text-xs text-red-400 font-medium">{vuln.type}</span>
                                <Badge className={`text-[10px] ${getSeverityColor(vuln.severity)}`}>
                                  {vuln.severity}
                                </Badge>
                              </div>
                              <p className="text-xs text-red-300/70 mt-1">{vuln.description}</p>
                            </div>
                          )}
                          
                          {/* Fix Diff */}
                          {showDiff === lineNum && fix && (
                            <div className="bg-zinc-900 border-l-2 border-green-500 pl-12 pr-4 py-2 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="h-3 w-3 text-green-400" />
                                  <span className="text-xs text-green-400 font-medium">AI-Generated Fix</span>
                                </div>
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="h-6 px-3 text-xs bg-green-600 hover:bg-green-700"
                                  onClick={() => applyFix(fix)}
                                >
                                  Apply This Fix
                                </Button>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-start gap-2">
                                  <span className="text-red-400 font-mono text-xs">-</span>
                                  <code className="text-xs text-red-300 bg-red-500/10 px-1 rounded">
                                    {fix.original}
                                  </code>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-green-400 font-mono text-xs">+</span>
                                  <code className="text-xs text-green-300 bg-green-500/10 px-1 rounded whitespace-pre-wrap">
                                    {fix.fixed}
                                  </code>
                                </div>
                              </div>
                              <p className="text-xs text-zinc-400 italic">{fix.explanation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* No vulnerabilities */}
        {data && data.analysis.vulnerabilities.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-400" />
            <p className="text-sm">No vulnerabilities detected!</p>
            <p className="text-xs">Code appears to be secure.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
