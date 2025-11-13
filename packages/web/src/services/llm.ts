import type { Application } from '../types/index.js'

type Message = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

type ChatCompletionOptions = {
  model?: string
  messages: Message[]
  temperature?: number
  stream?: boolean
}

export const LLMService = (_app: Application) => {
  const apiKey = process.env.DASHSCOPE_API_KEY
  if (!apiKey) {
    throw new Error('DASHSCOPE_API_KEY is not set')
  }

  const baseURL = 'https://dashscope.aliyuncs.com/compatible-mode/v1'

  const chatCompletion = async (options: ChatCompletionOptions) => {
    const { model = 'qwen-plus', messages, temperature = 0.1, stream = false } = options

    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        stream,
      }),
    })

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status} ${response.statusText}`)
    }

    return response
  }

  return {
    chatCompletion,
  }
}
