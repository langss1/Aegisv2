import { NextRequest, NextResponse } from "next/server";
import { getAllHealings, getHealing, reverseHealing, approveHealing, clearAllHealings } from "@/lib/healingState";
import { editMessageText, getChatId } from "@/lib/telegram";

/**
 * GET /api/healing?sessionId=xxx
 */
export async function GET(req: NextRequest) {
  const sessionId = new URL(req.url).searchParams.get("sessionId");
  if (!sessionId) return NextResponse.json({ ok: false, error: "sessionId is required" }, { status: 400 });

  const healings = await getAllHealings(sessionId);
  console.log("[API /healing] Returning healings:", healings.map((h) => ({ id: h.id, status: h.status })));
  return NextResponse.json({ ok: true, healings, count: healings.length });
}

/**
 * POST /api/healing — Approve or reverse a healing from the dashboard
 * Body: { healingId, action: "approve" | "reverse", by?, sessionId }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { healingId, action, by = "Operator (Dashboard)" } = body;

    if (!healingId || !action) {
      return NextResponse.json({ error: "healingId and action are required" }, { status: 400 });
    }

    if (action === "approve") {
      const healingBefore = await getHealing(healingId);
      const result = await approveHealing(healingId, by);
      if (!result) {
        const existing = await getHealing(healingId);
        return NextResponse.json({
          ok: false,
          error: !existing ? "Healing not found" : `Already ${existing.status.toLowerCase()}`,
        });
      }

      if (healingBefore?.telegramMessageId && healingBefore?.telegramChatId) {
        const updatedText = `✅ <b>Healing APPROVED (Web Dashboard)</b>

<b>Healing ID:</b> <code>${result.id}</code>
<b>Attack:</b> ${result.attackType} (${result.severity})
<b>Patch:</b> ${result.patch}
<b>WAF Rule:</b> <code>${result.wafRuleId}</code>
<b>Approved by:</b> ${by}
<b>Time:</b> ${new Date().toLocaleString()}

🔒 Patch is now <b>permanent</b>. Reverse window closed.`;
        await editMessageText(healingBefore.telegramChatId, healingBefore.telegramMessageId, updatedText);
      }

      return NextResponse.json({ ok: true, healing: result, message: "Patch approved and locked" });
    }

    if (action === "reverse") {
      const healingBefore = await getHealing(healingId);
      const result = await reverseHealing(healingId, by);
      if (!result) {
        const existing = await getHealing(healingId);
        return NextResponse.json({
          ok: false,
          error: !existing
            ? "Healing not found"
            : existing.status === "Expired"
            ? "Reverse window expired"
            : `Already ${existing.status.toLowerCase()}`,
        });
      }

      if (healingBefore?.telegramMessageId && healingBefore?.telegramChatId) {
        const updatedText = `🔄 <b>Healing REVERTED (Web Dashboard)</b>

<b>Healing ID:</b> <code>${result.id}</code>
<b>Attack:</b> ${result.attackType} (${result.severity})
<b>Patch removed:</b> ${result.patch}
<b>WAF Rule disabled:</b> <code>${result.wafRuleId}</code>
<b>Reverted by:</b> ${by}
<b>Time:</b> ${new Date().toLocaleString()}

⚠️ <b>Warning:</b> Endpoint is now <b>unprotected</b> against ${result.attackType}.`;
        await editMessageText(healingBefore.telegramChatId, healingBefore.telegramMessageId, updatedText);
      }

      return NextResponse.json({
        ok: true,
        healing: result,
        message: `Patch "${result.patch}" reversed, WAF rule ${result.wafRuleId} disabled`,
      });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

/**
 * DELETE /api/healing?sessionId=xxx — Clear all healing actions for a session
 */
export async function DELETE(req: NextRequest) {
  const sessionId = new URL(req.url).searchParams.get("sessionId");
  if (!sessionId) return NextResponse.json({ ok: false, error: "sessionId is required" }, { status: 400 });

  await clearAllHealings(sessionId);
  console.log(`[API /healing] Cleared all healing actions for session ${sessionId}`);
  return NextResponse.json({ ok: true, message: "All healing actions cleared" });
}
