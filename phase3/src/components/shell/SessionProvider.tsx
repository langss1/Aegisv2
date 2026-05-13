"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";

export interface MonitoringSession {
  id: string;
  repoUrl: string;
  repoName: string;
  branch: string;
  addedAt: number;
  lastActive?: number;
}

interface SessionContextType {
  sessions: MonitoringSession[];
  activeSessionId: string | null;
  activeSession: MonitoringSession | null;
  loading: boolean;
  addSession: (repoUrl: string, branch?: string) => Promise<MonitoringSession | null>;
  removeSession: (id: string) => Promise<void>;
  setActiveSession: (id: string) => void;
  refresh: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({
  sessions: [],
  activeSessionId: null,
  activeSession: null,
  loading: true,
  addSession: async () => null,
  removeSession: async () => {},
  setActiveSession: () => {},
  refresh: async () => {},
});

const ACTIVE_KEY = "aegis_active_session";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<MonitoringSession[]>([]);
  const [activeSessionId, setActiveSessionIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch("/api/sessions");
      const data = await res.json();
      if (data.ok && data.sessions) {
        const mapped: MonitoringSession[] = data.sessions.map((s: any) => ({
          id: s.id,
          repoUrl: s.repo_url,
          repoName: s.repo_name,
          branch: s.branch,
          addedAt: s.added_at,
          lastActive: s.last_active,
        }));
        setSessions(mapped);
        // Restore active session from localStorage
        const savedActive = localStorage.getItem(ACTIVE_KEY);
        if (savedActive && mapped.find((s) => s.id === savedActive)) {
          setActiveSessionIdState(savedActive);
        } else if (mapped.length > 0) {
          setActiveSessionIdState(mapped[0].id);
          localStorage.setItem(ACTIVE_KEY, mapped[0].id);
        }
      }
    } catch (err) {
      console.error("[SessionProvider] fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const addSession = useCallback(
    async (repoUrl: string, branch = "main"): Promise<MonitoringSession | null> => {
      try {
        const res = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ repoUrl, branch }),
        });
        const data = await res.json();
        if (!data.ok) { console.error("[SessionProvider] add error:", data.error); return null; }
        const s = data.session;
        const session: MonitoringSession = {
          id: s.id,
          repoUrl: s.repo_url,
          repoName: s.repo_name,
          branch: s.branch,
          addedAt: s.added_at,
        };
        setSessions((prev) => [...prev, session]);
        if (!activeSessionId) {
          setActiveSessionIdState(session.id);
          localStorage.setItem(ACTIVE_KEY, session.id);
        }
        return session;
      } catch (err) {
        console.error("[SessionProvider] addSession error:", err);
        return null;
      }
    },
    [activeSessionId]
  );

  const removeSession = useCallback(
    async (id: string) => {
      try {
        await fetch(`/api/sessions?id=${id}`, { method: "DELETE" });
        setSessions((prev) => {
          const next = prev.filter((s) => s.id !== id);
          if (activeSessionId === id) {
            const newActive = next[0]?.id ?? null;
            setActiveSessionIdState(newActive);
            if (newActive) localStorage.setItem(ACTIVE_KEY, newActive);
            else localStorage.removeItem(ACTIVE_KEY);
          }
          return next;
        });
      } catch (err) {
        console.error("[SessionProvider] removeSession error:", err);
      }
    },
    [activeSessionId]
  );

  const setActiveSession = useCallback((id: string) => {
    setActiveSessionIdState(id);
    localStorage.setItem(ACTIVE_KEY, id);
  }, []);

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;

  return (
    <SessionContext.Provider
      value={{
        sessions,
        activeSessionId,
        activeSession,
        loading,
        addSession,
        removeSession,
        setActiveSession,
        refresh: fetchSessions,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
