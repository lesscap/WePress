import type { FastifyInstance } from 'fastify'

type ParseArticleBody = {
  content: string
}

const ParseArticleSchema = {
  summary: 'Parse article into structured sections',
  tags: ['article'],
  body: {
    type: 'object',
    required: ['content'],
    properties: {
      content: { type: 'string', minLength: 1, description: 'Article content' },
    },
  },
}

const SYSTEM_PROMPT = `你是一个专业的文章结构化助手。将用户文章分解为主标题和多个段落。

**严格要求：**
1. 绝对不能修改、润色、删减原文内容
2. 只做结构化处理：提取标题、划分段落
3. 保持原文的用词、语气、标点完全一致

**任务：**
1. 提取文章主标题
2. 将文章分成多个段落，每段提取小标题
3. 段落内容使用 markdown 格式
4. 返回严格的 JSON 格式，不要添加任何额外说明：
{
  "title": "主标题",
  "sections": [
    {"title": "段落标题", "body": "段落内容"}
  ]
}

**重要：只返回 JSON，不要包含任何其他文字或解释。**`

export const ArticleController = (app: FastifyInstance) => {
  app.post<{ Body: ParseArticleBody }>('/parse', { schema: ParseArticleSchema }, async (request, reply) => {
    const { content } = request.body

    try {
      // @ts-expect-error - llm service is added dynamically
      const llm = app.llm

      const response = await llm.chatCompletion({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content },
        ],
        stream: true,
      })

      // Set SSE headers
      reply.raw.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      })

      // Stream the response
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
          const lines = chunk.split('\n').filter(line => line.trim())

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue

              try {
                const json = JSON.parse(data)
                const delta = json.choices?.[0]?.delta?.content
                if (delta) {
                  reply.raw.write(`data: ${JSON.stringify({ delta })}\n\n`)
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      } finally {
        reply.raw.end()
      }
    } catch (error) {
      app.log.error(error)
      if (!reply.sent) {
        return reply.code(500).send({
          success: false,
          code: 'PARSE_FAILED',
          message: 'Failed to parse article',
        })
      }
    }
  })
}
