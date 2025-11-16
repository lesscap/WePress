import type { ToolDefinition, ToolCall, ToolResult } from '@wepress/agent-query'
import type { Section } from '@/types/editor'

/**
 * Tool definitions
 */
export const AGENT_TOOLS: ToolDefinition[] = [
  {
    name: 'clearSections',
    description: '清空文章所有段落（用于开始新文章）',
    parameters: {
      type: 'object',
      properties: {},
    },
  },

  {
    name: 'appendSection',
    description: '添加一个新段落到文章末尾',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: '段落标题' },
        level: { type: 'number', description: '标题级别1-6，默认2' },
        body: { type: 'string', description: '段落内容（markdown格式）' },
      },
      required: ['title', 'body'],
    },
  },

  {
    name: 'getSection',
    description: '获取指定段落的内容',
    parameters: {
      type: 'object',
      properties: {
        index: { type: 'number', description: '段落索引（从0开始）' },
      },
      required: ['index'],
    },
  },

  {
    name: 'updateSection',
    description: '更新指定段落的内容',
    parameters: {
      type: 'object',
      properties: {
        index: { type: 'number', description: '段落索引' },
        title: { type: 'string', description: '新标题（可选）' },
        body: { type: 'string', description: '新内容（可选）' },
      },
      required: ['index'],
    },
  },

  {
    name: 'getArticle',
    description: '获取完整文章内容（所有段落）',
    parameters: {
      type: 'object',
      properties: {},
    },
  },

  {
    name: 'getSelectedText',
    description: '获取当前选中的文本内容',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
]

/**
 * Tool handler type
 */
type ToolHandler = (args: Record<string, unknown>) => Promise<ToolResult>

/**
 * Create tool executor
 */
export function createToolExecutor(context: {
  sections: Section[]
  setSections: (sections: Section[] | ((prev: Section[]) => Section[])) => void
  selectedText?: string
}) {
  // Define tool handlers
  const handlers: Record<string, ToolHandler> = {
    clearSections: async () => {
      context.setSections([])
      return { result: '已清空所有段落' }
    },

    appendSection: async args => {
      const {
        title,
        level = 2,
        body,
      } = args as {
        title: string
        level?: number
        body: string
      }

      const newSection: Section = {
        id: `section-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title,
        level: Math.max(1, Math.min(6, level)) as 1 | 2 | 3 | 4 | 5 | 6,
        body,
      }

      context.setSections(prev => [...prev, newSection])
      return { result: `已添加段落：${title}` }
    },

    getSection: async args => {
      const { index } = args as { index: number }
      const section = context.sections[index]

      if (!section) {
        return { error: `段落 ${index} 不存在` }
      }

      return {
        result: {
          id: section.id,
          title: section.title,
          level: section.level,
          body: section.body,
        },
      }
    },

    updateSection: async args => {
      const { index, title, body } = args as {
        index: number
        title?: string
        body?: string
      }

      const section = context.sections[index]
      if (!section) {
        return { error: `段落 ${index} 不存在` }
      }

      context.setSections(prev =>
        prev.map((s, i) => {
          if (i !== index) return s
          return {
            ...s,
            title: title ?? s.title,
            body: body ?? s.body,
          }
        }),
      )

      return { result: `已更新段落：${title || section.title}` }
    },

    getArticle: async () => {
      const content = context.sections.map((s, i) => ({
        index: i,
        id: s.id,
        title: s.title,
        level: s.level,
        body: s.body,
      }))

      return { result: content }
    },

    getSelectedText: async () => {
      if (!context.selectedText) {
        return { error: '没有选中文本' }
      }
      return { result: context.selectedText }
    },
  }

  return async (call: ToolCall): Promise<ToolResult> => {
    const { name, arguments: args } = call

    try {
      const handler = handlers[name]
      if (!handler) {
        return { error: `未知工具: ${name}` }
      }

      return await handler(args)
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }
}
