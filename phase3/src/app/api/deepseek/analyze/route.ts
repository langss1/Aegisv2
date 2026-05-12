import { NextRequest, NextResponse } from "next/server";
import { analyzeAttack } from "@/lib/deepseek";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { type, severity, payloadSnippet, targetEndpoint, method, sourceIp } = body;

    if (!type || !payloadSnippet) {
      return NextResponse.json(
        { error: "Missing required fields: type, payloadSnippet" },
        { status: 400 },
      );
    }

    const analysis = await analyzeAttack({
      type,
      severity: severity || "Medium",
      payloadSnippet,
      targetEndpoint: targetEndpoint || "/unknown",
      method: method || "GET",
      sourceIp: sourceIp || "unknown",
    });

    return NextResponse.json({ ok: true, analysis });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
