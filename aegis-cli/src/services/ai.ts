/**
 * Aegis Security AI Engine - Service Layer
 * This service handles communication between the CLI/Web UI and 
 * various intelligence providers (Aegis Pro, Ollama, Custom).
 */

export type AIProvider = 'aegis' | 'ollama' | 'custom'

export interface AIRequest {
  provider: AIProvider
  prompt: string
  context?: string
  config?: {
    apiKey?: string
    model?: string
  }
}

export interface AIResponse {
  success: boolean
  content: string
  metadata?: any
}

export class AIService {
  static async process(request: AIRequest): Promise<AIResponse> {
    const { provider, prompt, config } = request;

    try {
      switch (provider) {
        case 'aegis': {
          // aegis uses deepseek under the hood with the provided elite key
          const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer sk-fcc206047ecc4f97bc5d5d97e81054cc`
            },
            body: JSON.stringify({
              model: 'deepseek-coder',
              messages: [
                { role: 'system', content: 'anda adalah aegis security engine. berikan analisis keamanan kode yang mendalam dan solusi remediasi.' },
                { role: 'user', content: prompt }
              ],
              temperature: 0.2
            })
          });
          const data = await response.json();
          return { success: true, content: data.choices[0].message.content };
        }

        case 'ollama': {
          // local ollama endpoint
          const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            body: JSON.stringify({
              model: config?.model || 'deepseek-coder',
              prompt: prompt,
              stream: false
            })
          });
          const data = await response.json();
          return { success: true, content: data.response };
        }

        case 'custom': {
          if (!config?.apiKey) {
            return { success: false, content: 'error: api key kustom tidak ditemukan. gunakan "config ai" untuk mengaturnya.' };
          }
          // custom provider (default to openai-style compatible api)
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify({
              model: config.model || 'gpt-4',
              messages: [{ role: 'user', content: prompt }]
            })
          });
          const data = await response.json();
          return { success: true, content: data.choices[0].message.content };
        }

        default:
          return { success: false, content: 'error: provider inteligensi tidak dikenal.' };
      }
    } catch (error: any) {
      return { success: false, content: `error: gagal berkomunikasi dengan provider (${error.message})` };
    }
  }
}
