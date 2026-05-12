"use client";

import { useState, useMemo } from "react";
import { Pause, Play, Trash2, Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useLogStore } from "@/store/logStore";
import { formatTime } from "@/lib/format";
import type { LogLevel } from "@/lib/types";

const LEVEL_TONE: Record<LogLevel, "secondary" | "info" | "warning" | "destructive"> = {
  debug: "secondary",
  info: "info",
  warn: "warning",
  error: "destructive",
};

export function LogStream() {
  const logs = useLogStore((s) => s.logs);
  const paused = useLogStore((s) => s.paused);
  const togglePause = useLogStore((s) => s.togglePause);
  const clear = useLogStore((s) => s.clear);

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<LogLevel | "all">("all");

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      if (levelFilter !== "all" && l.level !== levelFilter) return false;
      if (search && !l.msg.toLowerCase().includes(search.toLowerCase()) && !l.source.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [logs, levelFilter, search]);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-row items-center justify-between gap-2 flex-wrap">
        <CardTitle>Log Stream</CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-7 w-40 rounded-md border border-border bg-background pl-7 pr-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as LogLevel | "all")}
            className="h-7 rounded-md border border-border bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">All levels</option>
            <option value="error">Error</option>
            <option value="warn">Warn</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </select>
          <Button variant="ghost" size="icon" onClick={togglePause} title={paused ? "Resume" : "Pause"}>
            {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={clear} title="Clear">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto max-h-[calc(100vh-260px)] scrollbar-thin p-0">
        {paused && (
          <div className="sticky top-0 z-10 border-b border-warning/30 bg-warning/10 px-4 py-1 text-center text-[10px] text-warning font-medium">
            Paused — new logs are being buffered
          </div>
        )}
        <table className="w-full text-[11px]">
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-muted-foreground">
                  No logs to display
                </td>
              </tr>
            )}
            {filtered.map((l) => (
              <tr key={l.id} className="border-b border-border/50 hover:bg-secondary/40">
                <td className="whitespace-nowrap px-3 py-1.5 font-mono-tabular text-muted-foreground">
                  {formatTime(l.ts)}
                </td>
                <td className="px-2 py-1.5">
                  <Badge tone={LEVEL_TONE[l.level]}>{l.level}</Badge>
                </td>
                <td className="px-2 py-1.5 text-muted-foreground font-mono-tabular">
                  {l.source}
                </td>
                <td className="px-3 py-1.5 text-foreground break-all">
                  {l.msg}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
