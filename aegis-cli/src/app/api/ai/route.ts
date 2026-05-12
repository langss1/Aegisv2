import { NextResponse } from 'next/server'
import { AIService, AIProvider } from '@/services/ai'

export async function POST(request: Request) {
  try {
    const { provider, prompt, config } = await request.json()

    const result = await AIService.process({
      provider: provider as AIProvider,
      prompt,
      config
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        response: result.content
      })
    } else {
      return NextResponse.json({ success: false, error: result.content }, { status: 400 })
    }

  } catch (error) {
    console.error('AI_BACKEND_ERROR:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
