import { NextRequest, NextResponse } from "next/server";

/**
 * In-memory log store.  Stored on globalThis so hot-reload in dev does not
 * wipe recent log lines.
 */
export interface ServerLogLine {
  id: string;
  ts: number;
  level: "info" | "warn" | "error" | "debug";
  source: string;
  message: string;
  meta?: Record<string, unknown>;
}

interface LogGlobalStore {
  lines: ServerLogLine[];
  max: number;
}

const g = globalThis as typeof globalThis & { __aegisLogStore?: LogGlobalStore };
if (!g.__aegisLogStore) {
  g.__aegisLogStore = { lines: [], max: 500 };
}
const store = g.__aegisLogStore;

function randomId() {
  return Math.random().toString(36).slice(2, 12);
}

/**
 * GET /api/logs            -> latest N lines (default 100, cap 500)
 *     ?since=<ts>          -> only lines with ts > since
 *     ?level=warn          -> filter by level
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const since = searchParams.get("since");
  const level = searchParams.get("level");
  const limitRaw = searchParams.get("limit");
  const limit = Math.min(Math.max(Number(limitRaw) || 100, 1), store.max);

  let lines = store.lines;
  if (since) {
    const sinceTs = parseInt(since, 10);
    if (!Number.isNaN(sinceTs)) lines = lines.filter((l) => l.ts > sinceTs);
  }
  if (level) lines = lines.filter((l) => l.level === level);

  return NextResponse.json({
    ok: true,
    lines: lines.slice(0, limit),
    count: lines.length,
  });
}

/**
 * POST /api/logs
 * Body: { level?: "info"|"warn"|"error"|"debug", message: string,
 *         source?: string, meta?: object }
 *
 * Called by the vulnerable-app `logFailedAttempt` helper when an attack
 * attempt is blocked but not actually successful.  Keeping this endpoint
 * silent-but-acceptant means the vulnerable-app's `.catch(() => {})` no
 * longer swallows a 404 on every failed attempt.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const level = (["info", "warn", "error", "debug"] as const).includes(body.level)
      ? body.level
      : "info";
    const message = typeof body.message === "string" ? body.message : "";
    const source = typeof body.source === "string" ? body.source : "vulnerable-app";
    const meta = body.meta && typeof body.meta === "object" ? body.meta : undefined;

    if (!message) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const line: ServerLogLine = {
      id: `log_${randomId()}`,
      ts: Date.now(),
      level,
      source,
      message,
      meta,
    };

    store.lines.unshift(line);
    if (store.lines.length > store.max) {
      store.lines = store.lines.slice(0, store.max);
    }

    return NextResponse.json({ ok: true, id: line.id });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

/**
 * DELETE /api/logs -> clear everything.
 */
export async function DELETE() {
  store.lines = [];
  return NextResponse.json({ ok: true, message: "All logs cleared" });
}
