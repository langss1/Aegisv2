import { NextRequest, NextResponse } from "next/server";
import { sendMessage, getChatId, buildHealingMessage, buildHealingKeyboard } from "@/lib/telegram";
import { registerHealing, getHealing } from "@/lib/healingState";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const chatId = getChatId();

    if (!chatId) {
      return NextResponse.json(
        { error: "TELEGRAM_CHAT_ID not configured. Call /api/telegram/setup first." },
        { status: 400 },
      );
    }

    const { type, payload } = body;

    if (type === "healing") {
      const text = buildHealingMessage(payload);
      const keyboard = buildHealingKeyboard(payload.id);
      const result = await sendMessage(chatId, text, keyboard);

      // Register healing in server-side store so Telegram callbacks can approve/reverse
      if (!getHealing(payload.id)) {
        registerHealing({
          id: payload.id,
          attackType: payload.attackType,
          severity: payload.severity,
          sourceIp: payload.sourceIp || "unknown",
          targetEndpoint: payload.targetEndpoint || "unknown",
          method: payload.method || "GET",
          payload: payload.payload || "",
          patch: payload.patch,
          wafRuleId: payload.wafRuleId,
          status: "Applied",
          appliedAt: payload.appliedAt || Date.now(),
          reverseDeadline: payload.reverseDeadline || Date.now() + 30 * 60 * 1000,
        });
      }

      return NextResponse.json({ ok: true, result });
    }

    if (type === "alert") {
      const text = `⚠️ <b>AEGIS Alert</b>\n\n<b>Type:</b> ${payload.attackType || payload.type}\n<b>Severity:</b> ${payload.severity}\n<b>Source:</b> <code>${payload.sourceIp}</code>\n<b>Target:</b> <code>${payload.targetEndpoint}</code>\n<b>Payload:</b> <code>${payload.payloadSnippet}</code>`;
      const result = await sendMessage(chatId, text);
      return NextResponse.json({ ok: true, result });
    }

    if (type === "log") {
      const text = `📋 <b>AEGIS Log</b>\n\n${payload.message || payload.msg}`;
      const result = await sendMessage(chatId, text);
      return NextResponse.json({ ok: true, result });
    }

    return NextResponse.json({ error: "Unknown type. Use: healing, alert, or log" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
