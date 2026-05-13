import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function parseRepoName(url: string): string {
  try {
    const cleaned = url.replace(/\.git$/, "").replace(/\/$/, "");
    const parts = cleaned.split("/");
    return parts.slice(-2).join("/") || cleaned;
  } catch {
    return url;
  }
}

// GET /api/sessions — list all monitoring sessions
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("monitoring_sessions")
    .select("*")
    .order("added_at", { ascending: true });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, sessions: data });
}

// POST /api/sessions — add a new repo to monitor
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { repoUrl, branch = "main" } = body;
  if (!repoUrl) return NextResponse.json({ ok: false, error: "repoUrl is required" }, { status: 400 });

  const id = `repo_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const session = {
    id,
    repo_url: repoUrl,
    repo_name: parseRepoName(repoUrl),
    branch,
    added_at: Date.now(),
  };

  const { data, error } = await supabaseAdmin.from("monitoring_sessions").insert(session).select().single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, session: data });
}

// DELETE /api/sessions?id=xxx — remove a session and all its data (cascades)
export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });

  const { error } = await supabaseAdmin.from("monitoring_sessions").delete().eq("id", id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, message: `Session ${id} deleted` });
}
