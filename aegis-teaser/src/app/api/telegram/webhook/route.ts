import { NextRequest, NextResponse } from 'next/server'

// Store pending approvals (in production, use Redis or database)
const pendingApprovals = new Map<string, {
  projectName: string
  repoUrl: string
  status: 'pending' | 'approved' | 'rejected'
  timestamp: number
}>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle callback query (button press)
    if (body.callback_query) {
      const callbackData = body.callback_query.data
      const chatId = body.callback_query.message.chat.id
      const messageId = body.callback_query.message.message_id
      
      const [action, sessionId] = callbackData.split('_')
      
      const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
      
      if (action === 'approve') {
        // Update approval status
        const approval = pendingApprovals.get(sessionId)
        if (approval) {
          approval.status = 'approved'
          pendingApprovals.set(sessionId, approval)
        }
        
        // Edit message to show approved
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            message_id: messageId,
            text: `✅ *APPROVED*\n\nPushing security patches to repository...\n\nSession: ${sessionId}`,
            parse_mode: 'Markdown'
          })
        })
        
        // Answer callback to remove loading state
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            callback_query_id: body.callback_query.id,
            text: 'Changes approved! Pushing to repository...'
          })
        })
        
      } else if (action === 'reject') {
        const approval = pendingApprovals.get(sessionId)
        if (approval) {
          approval.status = 'rejected'
          pendingApprovals.set(sessionId, approval)
        }
        
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            message_id: messageId,
            text: `❌ *REJECTED*\n\nSecurity patches will not be pushed.\n\nSession: ${sessionId}`,
            parse_mode: 'Markdown'
          })
        })
        
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            callback_query_id: body.callback_query.id,
            text: 'Changes rejected.'
          })
        })
      }
    }
    
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Telegram webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

// API to check approval status
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('sessionId')
  
  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 })
  }
  
  const approval = pendingApprovals.get(sessionId)
  
  if (!approval) {
    return NextResponse.json({ status: 'not_found' })
  }
  
  return NextResponse.json({ 
    status: approval.status,
    projectName: approval.projectName,
    repoUrl: approval.repoUrl
  })
}

// API to create pending approval
export async function PUT(request: NextRequest) {
  const body = await request.json()
  const { sessionId, projectName, repoUrl } = body
  
  pendingApprovals.set(sessionId, {
    projectName,
    repoUrl,
    status: 'pending',
    timestamp: Date.now()
  })
  
  return NextResponse.json({ ok: true, sessionId })
}
