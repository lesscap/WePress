import type { Task, TaskRequest } from '@/types/task'
import type { AgentMessage, TodoList } from '@wepress/agent-query'

// Helper to create message ID
const createMsgId = () => Math.random().toString(36).slice(2, 11)

// Mock running task
export const mockRunningTask: Task = {
  id: 'task-1',
  agentKey: 'optimize-paragraph',
  scope: {
    type: 'section',
    sectionIndex: 2,
    sectionId: 'section-3',
    sectionTitle: '早期探索',
  },
  params: {
    style: 'formal',
    length: 'keep',
  },
  instruction: undefined,
  messages: [
    // Text delta messages (streaming)
    {
      type: 'text',
      messageId: createMsgId(),
      conversationId: 'conv-1',
      content: { text: '1950年代到1970年代，研究人员主要关注符号推理和专家系统。\n\n', status: 'DOING' },
      delta: true,
      timestamp: new Date().toISOString(),
    },
    {
      type: 'text',
      messageId: createMsgId(),
      conversationId: 'conv-1',
      content: { text: '这一时期诞生了许多开创性的工作：\n', status: 'DOING' },
      delta: true,
      timestamp: new Date().toISOString(),
    },
    {
      type: 'text',
      messageId: createMsgId(),
      conversationId: 'conv-1',
      content: { text: '- **LISP语言**（1958）：由约翰·麦卡锡发明，成为人工智能研究的首选编程语言\n', status: 'DOING' },
      delta: true,
      timestamp: new Date().toISOString(),
    },
    {
      type: 'text',
      messageId: createMsgId(),
      conversationId: 'conv-1',
      content: { text: '- **ELIZA**（1964-1966）：第一个聊天机器人，由约瑟夫·魏岑鲍姆开发', status: 'DOING' },
      delta: true,
      timestamp: new Date().toISOString(),
    },
  ],
  todoList: {
    items: [
      { status: 'completed', content: '分析段落结构' },
      { status: 'completed', content: '阅读父级段落《历史背景》' },
      { status: 'pending', content: '生成优化内容' },
    ],
    version: Date.now(),
  },
  startTime: Date.now() - 3000, // 3 seconds ago
  endTime: undefined,
}

// Mock completed tasks
export const mockCompletedTasks: Task[] = [
  {
    id: 'task-0',
    agentKey: 'parse-article',
    scope: { type: 'none' },
    params: {},
    instruction: undefined,
    messages: [
      {
        type: 'text',
        messageId: createMsgId(),
        conversationId: 'conv-0',
        content: {
          text: '已成功解析文章为 5 个段落',
          status: 'DONE',
        },
        delta: false,
        timestamp: new Date(Date.now() - 300000).toISOString(), // 5 min ago
      },
      {
        type: 'usage',
        messageId: createMsgId(),
        conversationId: 'conv-0',
        content: {
          promptTokens: 500,
          completionTokens: 200,
          totalTokens: 700,
        },
        timestamp: new Date(Date.now() - 300000).toISOString(),
      },
    ],
    todoList: {
      items: [
        { status: 'completed', content: '分析文章内容' },
        { status: 'completed', content: '生成段落结构' },
      ],
      version: Date.now(),
    },
    startTime: Date.now() - 310000, // 5 min 10 sec ago
    endTime: Date.now() - 300000, // 5 min ago
    usage: {
      inputTokens: 500,
      outputTokens: 200,
      totalTokens: 700,
    },
  },
  {
    id: 'task-00',
    agentKey: 'adjust-tone',
    scope: { type: 'none' },
    params: {
      style: 'professional',
    },
    instruction: undefined,
    messages: [
      {
        type: 'text',
        messageId: createMsgId(),
        conversationId: 'conv-00',
        content: {
          text: '已调整全文为专业风格',
          status: 'DONE',
        },
        delta: false,
        timestamp: new Date(Date.now() - 180000).toISOString(), // 3 min ago
      },
      {
        type: 'usage',
        messageId: createMsgId(),
        conversationId: 'conv-00',
        content: {
          promptTokens: 800,
          completionTokens: 150,
          totalTokens: 950,
        },
        timestamp: new Date(Date.now() - 180000).toISOString(),
      },
    ],
    todoList: {
      items: [
        { status: 'completed', content: '分析全文语气' },
        { status: 'completed', content: '调整为专业风格' },
      ],
      version: Date.now(),
    },
    startTime: Date.now() - 190000, // 3 min 10 sec ago
    endTime: Date.now() - 180000, // 3 min ago
    usage: {
      inputTokens: 800,
      outputTokens: 150,
      totalTokens: 950,
    },
  },
]

// Mock queued tasks (TaskRequest)
export const mockQueuedTasks: TaskRequest[] = [
  {
    id: 'req-1',
    agentKey: 'rewrite',
    scope: {
      type: 'section',
      sectionIndex: 2,
      sectionId: 'section-3',
      sectionTitle: '早期探索',
    },
    params: {},
    instruction: undefined,
    createdAt: Date.now() - 1000,
  },
  {
    id: 'req-2',
    agentKey: 'seo-optimize',
    scope: { type: 'none' },
    params: {},
    instruction: 'AI, machine learning',
    createdAt: Date.now(),
  },
]
