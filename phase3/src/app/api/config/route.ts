import { NextRequest, NextResponse } from "next/server";

/**
 * Runtime config store — simpan di memori server (bertahan selama proses hidup).
 * Untuk produksi, simpan di database / file.
 */
export const runtimeConfig: {
  telegramBotToken: string;
  telegramChatId: string;
  deepseekApiKey: string;
} = {
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || "",
  telegramChatId: process.env.TELEGRAM_CHAT_ID || "",
  deepseekApiKey: process.env.DEEPSEEK_API_KEY || "sk-fcc206047ecc4f97bc5d5d97e81054cc",
};

export async function GET() {
  return NextResponse.json({
    telegramBotToken: runtimeConfig.telegramBotToken
      ? runtimeConfig.telegramBotToken.replace(/^(.{8}).*(.{4})$/, "$1****$2")
      : "",
    telegramBotTokenSet: !!runtimeConfig.telegramBotToken,
    telegramChatId: runtimeConfig.telegramChatId,
    deepseekApiKeySet: !!runtimeConfig.deepseekApiKey,
    deepseekApiKey: runtimeConfig.deepseekApiKey
      ? runtimeConfig.deepseekApiKey.replace(/^(.{5}).*(.{4})$/, "$1****$2")
      : "",
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.telegramBotToken !== undefined) {
      runtimeConfig.telegramBotToken = body.telegramBotToken.trim();
    }
    if (body.telegramChatId !== undefined) {
      runtimeConfig.telegramChatId = body.telegramChatId.trim();
    }
    if (body.deepseekApiKey !== undefined) {
      runtimeConfig.deepseekApiKey = body.deepseekApiKey.trim();
    }

    return NextResponse.json({ ok: true, message: "Configuration saved successfully" });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 400 });
  }
}
