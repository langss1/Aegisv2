import { NextRequest, NextResponse } from 'next/server'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, projectName, findings, summary, repoUrl, sessionId, pentestResults } = body

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return NextResponse.json({ success: false, message: 'Telegram not configured' })
    }

    let text = ''
    let replyMarkup = null

    switch (type) {
      case 'scan_start':
        text = 'Security Scan Started for ' + projectName
        break
      case 'phase1_complete':
        text = 'Phase 1 Complete: ' + findings + ' vulnerabilities found'
        break
      case 'phase2_complete':
        text = 'Phase 2 Complete: Pentest finished'
        break
      case 'phase3_complete':
        text = 'Phase 3 Complete: Approval Required for ' + projectName
        replyMarkup = {
          inline_keyboard: [[
            { text: 'Approve', callback_data: 'approve_' + sessionId },
            { text: 'Reject', callback_data: 'reject_' + sessionId }
          ]]
        }
        break
      case 'attack_blocked':
        text = 'Attack Blocked: ' + body.attackType + ' on ' + body.endpoint
        break
      default:
        text = body.message || 'AEGIS Notification'
    }

    const payload: any = { chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'Markdown' }
    if (replyMarkup) payload.reply_markup = replyMarkup

    const response = await fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await response.json()
    return NextResponse.json({ success: data.ok, messageId: data.result?.message_id })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
