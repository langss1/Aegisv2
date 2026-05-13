import { NextRequest, NextResponse } from "next/server";
import { registerAttack, getAllAttacks, clearAllAttacks, getAttacksSince } from "@/lib/attackState";
import { registerHealing } from "@/lib/healingState";
import { sendMessage, getChatId, buildHealingMessage, buildHealingKeyboard } from "@/lib/telegram";
import { recommendHealing } from "@/lib/deepseek";

function randomId() {
  return Math.random().toString(36).slice(2, 12);
}

/**
 * GET /api/attacks?sessionId=xxx&since=ts
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  const since = searchParams.get("since");

  if (!sessionId) {
    return NextResponse.json({ ok: false, error: "sessionId is required" }, { status: 400 });
  }

  const attacks = since
    ? await getAttacksSince(sessionId, parseInt(since))
    : await getAllAttacks(sessionId);

  return NextResponse.json({ ok: true, attacks, count: attacks.length });
}

/**
 * POST /api/attacks
 * Body: { sessionId, attackType, severity, payload, endpoint, method, sourceIp, autoHeal? }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sessionId,
      attackType,
      severity,
      payload,
      endpoint,
      method,
      sourceIp,
      autoHeal = true,
    } = body;

    if (!attackType) {
      return NextResponse.json({ error: "attackType is required" }, { status: 400 });
    }
    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    }

    const attackId = `atk_${randomId()}`;
    const timestamp = Date.now();

    // ─── Call DeepSeek AI to analyze the attack ───────────────
    console.log(`[Attacks API] Calling DeepSeek AI to analyze: ${attackType}`);
    let aiRecommendation;
    try {
      aiRecommendation = await recommendHealing({
        attackType,
        severity: severity || "High",
        payload: payload || "",
        endpoint: endpoint || "/unknown",
        method: method || "GET",
        sourceIp: sourceIp || "unknown",
      });
    } catch (aiErr) {
      console.error("[Attacks API] AI analysis failed:", aiErr);
      aiRecommendation = {
        shouldHeal: true,
        isFalsePositive: false,
        severity: severity || "High",
        attackType,
        patchName: `Auto Patch — ${attackType}`,
        wafRuleId: "WAF-GEN-001",
        blockPattern: "",
        explanation: "AI unavailable, applying generic protection",
        confidence: 50,
      };
    }

    if (aiRecommendation.isFalsePositive || !aiRecommendation.shouldHeal) {
      return NextResponse.json({
        ok: true,
        attackId,
        message: `Attack analyzed but determined to be false positive`,
        falsePositive: true,
        aiAnalysis: {
          explanation: aiRecommendation.explanation,
          confidence: aiRecommendation.confidence,
        },
        healing: null,
      });
    }

    await registerAttack({
      id: attackId,
      sessionId,
      type: aiRecommendation.attackType,
      severity: aiRecommendation.severity,
      sourceIp: sourceIp || "unknown",
      targetEndpoint: endpoint || "/unknown",
      method: method || "GET",
      payload: payload || "",
      timestamp,
      blocked: true,
      source: "live",
    });

    let healingResult = null;

    if (autoHeal) {
      const healingId = `heal_${randomId()}`;
      const chatId = getChatId();

      let telegramMessageId: number | undefined;
      if (chatId) {
        const healingMsg = buildHealingMessage({
          id: healingId,
          attackType: aiRecommendation.attackType,
          severity: aiRecommendation.severity,
          patch: aiRecommendation.patchName,
          wafRuleId: aiRecommendation.wafRuleId,
          sourceIp,
          targetEndpoint: endpoint,
        });
        const keyboard = buildHealingKeyboard(healingId);
        const liveMsg = `🔴 <b>LIVE ATTACK DETECTED</b>\n🤖 <i>AI Confidence: ${aiRecommendation.confidence}%</i>\n\n${healingMsg}\n\n💡 <b>AI Analysis:</b> ${aiRecommendation.explanation}`;
        const result = await sendMessage(chatId, liveMsg, keyboard);
        telegramMessageId = result.ok ? result.result?.message_id : undefined;
      }

      await registerHealing({
        id: healingId,
        sessionId,
        attackType: aiRecommendation.attackType,
        severity: aiRecommendation.severity,
        sourceIp: sourceIp || "unknown",
        targetEndpoint: endpoint || "/unknown",
        method: method || "GET",
        payload: payload || "",
        patch: aiRecommendation.patchName,
        wafRuleId: aiRecommendation.wafRuleId,
        blockPattern: aiRecommendation.blockPattern,
        status: "Applied",
        appliedAt: timestamp,
        reverseDeadline: timestamp + 30 * 60 * 1000,
        telegramMessageId,
        telegramChatId: chatId,
      });

      healingResult = {
        healingId,
        patch: aiRecommendation.patchName,
        wafRuleId: aiRecommendation.wafRuleId,
        blockPattern: aiRecommendation.blockPattern,
        telegramNotified: !!telegramMessageId,
        aiConfidence: aiRecommendation.confidence,
      };
    }

    return NextResponse.json({
      ok: true,
      attackId,
      message: `Attack registered: ${aiRecommendation.attackType}`,
      aiAnalysis: {
        explanation: aiRecommendation.explanation,
        confidence: aiRecommendation.confidence,
      },
      healing: healingResult,
    });
  } catch (err) {
    console.error("[Attacks API] Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

/**
 * DELETE /api/attacks?sessionId=xxx
 */
export async function DELETE(req: NextRequest) {
  const sessionId = new URL(req.url).searchParams.get("sessionId");
  if (!sessionId) return NextResponse.json({ ok: false, error: "sessionId is required" }, { status: 400 });
  await clearAllAttacks(sessionId);
  return NextResponse.json({ ok: true, message: "All attacks for session cleared" });
}
