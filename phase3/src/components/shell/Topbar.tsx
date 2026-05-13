"use client";

import { useEffect, useRef, useState } from "react";
import { Activity, ChevronDown, GitBranch, Plus, Trash2, X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useSession } from "@/components/shell/SessionProvider";

export function Topbar() {
  const [time, setTime] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [branch, setBranch] = useState("main");
  const [adding, setAdding] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const { sessions, activeSession, activeSessionId, loading, addSession, removeSession, setActiveSession } =
    useSession();

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setOpen(false);
        setShowAdd(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleAdd = async () => {
    if (!repoUrl.trim()) return;
    setAdding(true);
    const session = await addSession(repoUrl.trim(), branch.trim() || "main");
    if (session) {
      setActiveSession(session.id);
      setRepoUrl("");
      setBranch("main");
      setShowAdd(false);
      setOpen(false);
    }
    setAdding(false);
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-sm">
      {/* Left: System status */}
      <div className="flex items-center gap-3">
        <Badge tone="success" className="gap-1.5">
          <Activity className="h-3 w-3" />
          System Online
        </Badge>
      </div>

      {/* Center: Repo Selector */}
      <div className="relative" ref={dropRef}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-secondary transition-colors"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
          ) : (
            <GitBranch className="h-3.5 w-3.5 text-primary" />
          )}
          <span className="max-w-[220px] truncate">
            {activeSession ? activeSession.repoName : "Select Repository…"}
          </span>
          {activeSession && (
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary font-mono">
              {activeSession.branch}
            </span>
          )}
          <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute left-1/2 top-full mt-1 w-80 -translate-x-1/2 rounded-xl border border-border bg-card shadow-2xl z-50">
            {/* Session List */}
            <div className="max-h-60 overflow-y-auto py-1">
              {sessions.length === 0 ? (
                <p className="px-4 py-3 text-xs text-muted-foreground text-center">
                  No repositories added yet.
                </p>
              ) : (
                sessions.map((s) => (
                  <div
                    key={s.id}
                    className={`group flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-secondary transition-colors ${
                      s.id === activeSessionId ? "bg-primary/5 text-primary" : ""
                    }`}
                    onClick={() => { setActiveSession(s.id); setOpen(false); }}
                  >
                    <GitBranch className="h-3.5 w-3.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold truncate">{s.repoName}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{s.repoUrl}</div>
                    </div>
                    <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                      {s.branch}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeSession(s.id); }}
                      className="hidden group-hover:flex h-5 w-5 items-center justify-center rounded hover:bg-destructive/20 hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Add Repository */}
            {showAdd ? (
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold">Add Repository</span>
                  <button onClick={() => setShowAdd(false)}>
                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
                <input
                  autoFocus
                  type="text"
                  placeholder="https://github.com/user/repo.git"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs outline-none focus:border-primary placeholder:text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="branch (default: main)"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs outline-none focus:border-primary placeholder:text-muted-foreground"
                />
                <button
                  onClick={handleAdd}
                  disabled={adding || !repoUrl.trim()}
                  className="w-full flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {adding ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                  {adding ? "Adding…" : "Add & Monitor"}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAdd(true)}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Repository…
              </button>
            )}
          </div>
        )}
      </div>

      {/* Right: Clock */}
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs text-muted-foreground tabular-nums">{time}</span>
      </div>
    </header>
  );
}
