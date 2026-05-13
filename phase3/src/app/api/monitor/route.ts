import { NextRequest, NextResponse } from "next/server";
import { addMonitor, checkTargets } from "@/lib/monitor";

/**
 * POST /api/monitor
 * Body: { url, name }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, name } = body;

    if (!url || !name) {
      return NextResponse.json({ error: "url and name are required" }, { status: 400 });
    }

    await addMonitor(url, name);
    // Initial check
    await checkTargets();

    return NextResponse.json({ ok: true, message: `Monitoring started for ${url}` });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

/**
 * GET /api/monitor
 * Triggers a manual check of all targets
 */
export async function GET() {
  await checkTargets();
  return NextResponse.json({ ok: true, message: "Manual check triggered" });
}
