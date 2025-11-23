import type { FastifyInstance } from 'fastify'

type GenerateImageBody = {
  prompt: string
  size?: string
  negativePrompt?: string
}

const DASHSCOPE_IMAGE_API = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation'

const GenerateImageSchema = {
  summary: 'Generate image from text prompt',
  tags: ['image'],
  body: {
    type: 'object',
    required: ['prompt'],
    properties: {
      prompt: { type: 'string', description: 'Image generation prompt' },
      size: { type: 'string', description: 'Image size (default: 1328*1328)' },
      negativePrompt: { type: 'string', description: 'Negative prompt' },
    },
  },
}

export const ImageController = (app: FastifyInstance) => {
  app.post<{ Body: GenerateImageBody }>('/generate', { schema: GenerateImageSchema }, async (request, reply) => {
    const { prompt, size = '1328*1328', negativePrompt = '' } = request.body

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
      const response = await fetch(DASHSCOPE_IMAGE_API, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'qwen-image-plus',
          input: {
            messages: [
              {
                role: 'user',
                content: [{ text: prompt }],
              },
            ],
          },
          parameters: {
            negative_prompt: negativePrompt,
            prompt_extend: true,
            watermark: false,
            size,
          },
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        app.log.error('DashScope Image API error:', response.status, errorText)
        return reply.code(response.status).send({
          error: {
            message: `DashScope API error: ${response.status}`,
            type: 'api_error',
          },
        })
      }

      const data = await response.json()

      // Extract image URL from response
      const imageUrl = data.output?.choices?.[0]?.message?.content?.[0]?.image

      if (!imageUrl) {
        return reply.code(500).send({
          error: {
            message: 'No image URL in response',
            type: 'api_error',
          },
        })
      }

      return reply.send({
        success: true,
        image: imageUrl,
      })
    } catch (error) {
      app.log.error(error)
      return reply.code(500).send({
        error: {
          message: error instanceof Error ? error.message : 'Image generation failed',
          type: 'internal_error',
        },
      })
    }
  })
}
