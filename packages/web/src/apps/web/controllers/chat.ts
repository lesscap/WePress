import type { FastifyInstance } from 'fastify'

type Message = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

type ChatCompletionBody = {
  model: string
  messages: Message[]
  temperature?: number
  max_tokens?: number
  stream?: boolean
  stream_options?: {
    include_usage?: boolean
  }
}

const ChatCompletionSchema = {
  summary: 'Chat completion API (OpenAI compatible)',
  tags: ['chat'],
  body: {
    type: 'object',
    required: ['model', 'messages'],
    properties: {
      model: { type: 'string', description: 'Model name' },
      messages: {
        type: 'array',
        items: {
          type: 'object',
          required: ['role', 'content'],
          properties: {
            role: { type: 'string', enum: ['system', 'user', 'assistant'] },
            content: { type: 'string' },
          },
        },
      },
      temperature: { type: 'number', minimum: 0, maximum: 2 },
      max_tokens: { type: 'integer', minimum: 1 },
      stream: { type: 'boolean' },
      stream_options: {
        type: 'object',
        properties: {
          include_usage: { type: 'boolean' },
        },
      },
    },
  },
}

export const ChatController = (app: FastifyInstance) => {
  app.post<{ Body: ChatCompletionBody }>('/completions', { schema: ChatCompletionSchema }, async (request, reply) => {
    const { model = 'qwen-plus', messages, temperature = 0.3, max_tokens, stream = true } = request.body

    const apiKey = process.env.DASHSCOPE_API_KEY
    if (!apiKey) {
      return reply.code(500).send({
        error: {
          message: 'DASHSCOPE_API_KEY is not configured',
          type: 'configuration_error',
        },
      })
    }

    try {
      const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          ...(max_tokens && { max_tokens }),
          stream,
          ...(stream && { stream_options: request.body.stream_options }),
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        app.log.error('DashScope API error:', response.status, errorText)
        return reply.code(response.status).send({
          error: {
            message: `DashScope API error: ${response.status}`,
            type: 'api_error',
          },
        })
      }

      if (!stream) {
        const data = await response.json()
        return reply.send(data)
      }

      // Streaming response
      reply.raw.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      })

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      const decoder = new TextDecoder()

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          reply.raw.write(chunk)
        }
      } finally {
        reply.raw.end()
      }
    } catch (error) {
      app.log.error(error)
      if (!reply.sent) {
        return reply.code(500).send({
          error: {
            message: error instanceof Error ? error.message : 'Chat completion failed',
            type: 'internal_error',
          },
        })
      }
    }
  })
}
