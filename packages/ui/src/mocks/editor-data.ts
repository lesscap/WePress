import type { Section, Task, AgentDef } from '@/types/editor'

export const mockSections: Section[] = [
  {
    id: 'section-1',
    title: '人工智能的发展',
    level: 1,
    body: '人工智能（Artificial Intelligence，简称AI）是计算机科学的一个重要分支，旨在创建能够模拟人类智能行为的系统。'
  },
  {
    id: 'section-2',
    title: '历史背景',
    level: 2,
    body: '人工智能的概念最早可以追溯到1950年代，当时图灵提出了著名的"图灵测试"。这个测试旨在判断机器是否具有智能。'
  },
  {
    id: 'section-3',
    title: '早期探索',
    level: 3,
    body: '1950年代到1970年代，研究人员主要关注符号推理和专家系统。这一时期诞生了许多开创性的工作，如LISP语言和第一个聊天机器人ELIZA。'
  },
  {
    id: 'section-4',
    title: '重大突破',
    level: 3,
    body: '2010年代，深度学习的兴起带来了人工智能的新一轮革命。AlphaGo击败世界围棋冠军，标志着AI在复杂任务上取得了重大突破。'
  },
  {
    id: 'section-5',
    title: '当前应用',
    level: 2,
    body: '如今，人工智能已经广泛应用于各个领域，包括自然语言处理、计算机视觉、自动驾驶、医疗诊断等。'
  }
]

export const mockArticleLevelAgents: AgentDef[] = [
  {
    id: 'parse-article',
    name: '解析结构',
    icon: '📊',
    description: '将文章分解为结构化段落'
  },
  {
    id: 'adjust-tone',
    name: '调整语气',
    icon: '🎭',
    description: '调整全文语气风格',
    params: [
      {
        name: 'style',
        label: '目标风格',
        type: 'select',
        options: [
          { value: 'professional', label: '专业严谨' },
          { value: 'friendly', label: '亲切友好' },
          { value: 'humorous', label: '轻松幽默' },
          { value: 'academic', label: '学术正式' }
        ],
        defaultValue: 'professional',
        required: true
      }
    ],
    placeholder: '补充要求（可选）...'
  },
  {
    id: 'seo-optimize',
    name: 'SEO优化',
    icon: '🔍',
    description: '优化文章SEO',
    placeholder: '目标关键词或其他要求...'
  }
]

export const mockSectionLevelAgents: AgentDef[] = [
  {
    id: 'optimize-paragraph',
    name: '优化段落',
    icon: '✨',
    description: '提升可读性和逻辑性',
    params: [
      {
        name: 'style',
        label: '优化风格',
        type: 'select',
        options: [
          { value: 'formal', label: '正式规范' },
          { value: 'casual', label: '轻松口语' },
          { value: 'technical', label: '技术专业' }
        ],
        defaultValue: 'formal'
      },
      {
        name: 'length',
        label: '长度调整',
        type: 'radio',
        options: [
          { value: 'keep', label: '保持' },
          { value: 'concise', label: '精简' },
          { value: 'expand', label: '扩充' }
        ],
        defaultValue: 'keep'
      },
      {
        name: 'maxWords',
        label: '最大字数',
        type: 'number',
        min: 100,
        max: 1000,
        step: 50,
        defaultValue: 300,
        unit: '字'
      },
      {
        name: 'addExamples',
        label: '添加案例',
        type: 'boolean',
        defaultValue: false,
        description: '在段落中添加具体案例'
      },
      {
        name: 'tags',
        label: '应用场景',
        type: 'tags',
        options: [
          { value: 'blog', label: '博客' },
          { value: 'social', label: '社交媒体' },
          { value: 'news', label: '新闻稿' },
          { value: 'doc', label: '文档' }
        ],
        defaultValue: ['blog']
      }
    ],
    placeholder: '补充优化要求（可选）...'
  },
  {
    id: 'insert-image',
    name: '配图',
    icon: '🖼️',
    description: '为段落生成配图',
    params: [
      {
        name: 'imageStyle',
        label: '配图风格',
        type: 'text',
        placeholder: '例如：扁平插画、写实摄影',
        required: false
      },
      {
        name: 'creativity',
        label: '创意度',
        type: 'slider',
        min: 0,
        max: 100,
        step: 10,
        defaultValue: 50,
        unit: '%',
        description: '数值越高，配图越有创意'
      }
    ],
    placeholder: '其他配图要求...'
  },
  {
    id: 'expand-content',
    name: '扩展内容',
    icon: '➕',
    description: '增加更多细节和例子',
    placeholder: '希望扩展的方向...'
  }
]

export const mockTextLevelAgents: AgentDef[] = [
  {
    id: 'polish-text',
    name: '润色',
    icon: '✏️',
    description: '优化文字表达',
    placeholder: '润色要求（可选）...'
  },
  {
    id: 'translate',
    name: '翻译',
    icon: '🌐',
    description: '翻译选中文本',
    params: [
      {
        name: 'targetLang',
        label: '目标语言',
        type: 'select',
        options: [
          { value: 'en', label: 'English' },
          { value: 'zh', label: '中文' },
          { value: 'ja', label: '日本語' },
          { value: 'ko', label: '한국어' },
          { value: 'fr', label: 'Français' }
        ],
        defaultValue: 'en',
        required: true
      }
    ],
    placeholder: '翻译风格要求（可选）...'
  },
  {
    id: 'rewrite',
    name: '改写',
    icon: '🔄',
    description: '用不同方式表达',
    placeholder: '改写方向（可选）...'
  }
]

export const mockRunningTask: Task = {
  id: 'task-1',
  agentName: '优化段落',
  agentIcon: '✨',
  scopeDisplay: '第3段：早期探索',
  status: 'running',
  toolCalls: [
    { id: 'tool-1', displayName: '已获取文章结构', status: 'completed' },
    { id: 'tool-2', displayName: '已阅读父级段落《历史背景》', status: 'completed' },
    { id: 'tool-3', displayName: '正在生成优化内容...', status: 'running' }
  ],
  streamingOutput: `1950年代到1970年代，研究人员主要关注符号推理和专家系统。

这一时期诞生了许多开创性的工作：
- **LISP语言**（1958）：由约翰·麦卡锡发明，成为人工智能研究的首选编程语言
- **ELIZA**（1964-1966）：第一个聊天机器人，由约瑟夫·魏岑鲍姆开发，模拟心理治疗师的对话
- **专家系统**：基于规则的推理系统，在特定领域展现出专家级的问题解决能力

然而，这一时期也面临着算力不足和数据匮乏的挑战，导致了第一次人工智能寒冬的到来。`,
  timestamp: '刚刚'
}

export const mockQueuedTasks: Task[] = [
  {
    id: 'task-2',
    agentName: '配图',
    agentIcon: '🖼️',
    scopeDisplay: '第3段：早期探索',
    status: 'queued',
    toolCalls: [],
    timestamp: ''
  },
  {
    id: 'task-3',
    agentName: 'SEO优化',
    agentIcon: '🔍',
    scopeDisplay: '全文',
    status: 'queued',
    toolCalls: [],
    timestamp: ''
  }
]

export const mockCompletedTasks: Task[] = [
  {
    id: 'task-0',
    agentName: '解析结构',
    agentIcon: '📊',
    scopeDisplay: '全文',
    status: 'completed',
    toolCalls: [
      { id: 'tool-0-1', displayName: '已分析文章内容', status: 'completed' },
      { id: 'tool-0-2', displayName: '已生成段落结构', status: 'completed' }
    ],
    result: '已成功解析文章为 5 个段落',
    timestamp: '5分钟前'
  },
  {
    id: 'task-00',
    agentName: '调整语气',
    agentIcon: '🎭',
    scopeDisplay: '全文',
    status: 'completed',
    toolCalls: [
      { id: 'tool-00-1', displayName: '已分析全文语气', status: 'completed' },
      { id: 'tool-00-2', displayName: '已调整为专业风格', status: 'completed' }
    ],
    result: '已调整全文为专业风格',
    timestamp: '3分钟前'
  }
]
