import { NextRequest, NextResponse } from "next/server";
import { getAllHealings, getHealing, reverseHealing, approveHealing, clearAllHealings } from "@/lib/healingState";
import { editMessageText, getChatId } from "@/lib/telegram";

/**
 * GET /api/healing — Return all healing actions from server store
 * Query: ?since=<timestamp> to only get events since a time
 */
export async function GET(req: NextRequest) {
  const healings = getAllHealings();
  console.log("[API /healing] Returning healings:", healings.map(h => ({ id: h.id, status: h.status })));
  return NextResponse.json({ ok: true, healings, count: healings.length });
}

/**
 * POST /api/healing — Approve or reverse a healing from the dashboard
 * Body: { healingId, action: "approve" | "reverse", by?: string }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { healingId, action, by = "Operator (Dashboard)" } = body;

    if (!healingId || !action) {
      return NextResponse.json(
        { error: "healingId and action are required" },
        { status: 400 }
      );
    }

    if (action === "approve") {
      // Get healing first to access telegram info
      const healingBefore = getHealing(healingId);
      const result = approveHealing(healingId, by);
      if (!result) {
        const existing = getHealing(healingId);
        return NextResponse.json({
          ok: false,
          error: !existing ? "Healing not found" : `Already ${existing.status.toLowerCase()}`,
        });
      }
      
      // Update Telegram message if we have the message_id
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
        console.log(`[Healing API] Updated Telegram message ${healingBefore.telegramMessageId} for approve`);
      }
      
      return NextResponse.json({ ok: true, healing: result, message: "Patch approved and locked" });
    }

    if (action === "reverse") {
      // Get healing first to access telegram info
      const healingBefore = getHealing(healingId);
      const result = reverseHealing(healingId, by);
      if (!result) {
        const existing = getHealing(healingId);
        return NextResponse.json({
          ok: false,
          error: !existing
            ? "Healing not found"
            : existing.status === "Expired"
            ? "Reverse window expired"
            : `Already ${existing.status.toLowerCase()}`,
        });
      }
      
      // Update Telegram message if we have the message_id
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
        console.log(`[Healing API] Updated Telegram message ${healingBefore.telegramMessageId} for revert`);
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
 * DELETE /api/healing — Clear all healing actions (for testing/reset)
 */
export async function DELETE() {
  clearAllHealings();
  console.log("[API /healing] Cleared all healing actions");
  return NextResponse.json({ ok: true, message: "All healing actions cleared" });
}
