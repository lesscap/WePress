import type { AgentConfig } from '@/types/task'

const PARSE_ARTICLE_PROMPT = `你是文章结构化助手。将文章分解为标题和段落。

任务流程：
1. 分析文章结构
2. 提取主标题
3. 划分段落并提取小标题
4. 组织为 JSON 格式

严格要求：
- 不修改原文内容
- 保持原文用词、语气、标点
- 最终返回 JSON: {"title": "...", "sections": [{"title": "...", "body": "..."}]}`

const OPTIMIZE_PARAGRAPH_PROMPT = `你是段落优化助手。提升段落的可读性和逻辑性。

任务：
1. 分析段落结构和逻辑
2. 根据用户要求优化风格
3. 保持核心信息不变
4. 返回优化后的段落内容`

export const agentConfigs: Record<string, AgentConfig> = {
  'parse-article': {
    key: 'parse-article',
    name: '解析结构',
    icon: '📊',
    description: '将文章分解为结构化段落',
    scope: 'article',
    systemPrompt: PARSE_ARTICLE_PROMPT,
  },

  'optimize-paragraph': {
    key: 'optimize-paragraph',
    name: '优化段落',
    icon: '✨',
    description: '提升可读性和逻辑性',
    scope: 'section',
    params: [
      {
        name: 'style',
        label: '优化风格',
        type: 'select',
        options: [
          { value: 'formal', label: '正式规范' },
          { value: 'casual', label: '轻松口语' },
          { value: 'technical', label: '技术专业' },
        ],
        defaultValue: 'formal',
      },
      {
        name: 'length',
        label: '长度调整',
        type: 'radio',
        options: [
          { value: 'keep', label: '保持' },
          { value: 'concise', label: '精简' },
          { value: 'expand', label: '扩充' },
        ],
        defaultValue: 'keep',
      },
      {
        name: 'addExamples',
        label: '添加案例',
        type: 'boolean',
        defaultValue: false,
        description: '在段落中添加具体案例',
      },
      {
        name: 'tags',
        label: '应用场景',
        type: 'tags',
        options: [
          { value: 'blog', label: '博客' },
          { value: 'social', label: '社交媒体' },
          { value: 'news', label: '新闻稿' },
          { value: 'doc', label: '文档' },
        ],
        defaultValue: ['blog'],
      },
    ],
    placeholder: '补充优化要求（可选）...',
    systemPrompt: OPTIMIZE_PARAGRAPH_PROMPT,
  },

  'adjust-tone': {
    key: 'adjust-tone',
    name: '调整语气',
    icon: '🎭',
    description: '调整全文语气风格',
    scope: 'article',
    params: [
      {
        name: 'style',
        label: '目标风格',
        type: 'select',
        options: [
          { value: 'professional', label: '专业严谨' },
          { value: 'friendly', label: '亲切友好' },
          { value: 'humorous', label: '轻松幽默' },
          { value: 'academic', label: '学术正式' },
        ],
        defaultValue: 'professional',
        required: true,
      },
    ],
    placeholder: '补充要求（可选）...',
    systemPrompt: '你是语气调整助手。根据用户要求调整文章的语气风格。',
  },

  'seo-optimize': {
    key: 'seo-optimize',
    name: 'SEO优化',
    icon: '🔍',
    description: '优化文章SEO',
    scope: 'article',
    placeholder: '目标关键词或其他要求...',
    systemPrompt: '你是SEO优化助手。优化文章的搜索引擎友好性。',
  },

  'translate': {
    key: 'translate',
    name: '翻译',
    icon: '🌐',
    description: '翻译段落内容',
    scope: 'section',
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
        ],
        defaultValue: 'en',
        required: true,
      },
    ],
    placeholder: '翻译风格要求（可选）...',
    systemPrompt: '你是翻译助手。准确翻译内容，保持原文风格和含义。',
  },

  'rewrite': {
    key: 'rewrite',
    name: '改写',
    icon: '🔄',
    description: '用不同方式表达',
    scope: 'section',
    placeholder: '改写方向（可选）...',
    systemPrompt: '你是改写助手。用不同的方式表达相同的内容。',
  },
}

// Helper function
export function getAgentConfig(key: string): AgentConfig {
  const config = agentConfigs[key]
  if (!config) {
    throw new Error(`Agent config not found: ${key}`)
  }
  return config
}

// Get agents by scope
export function getAgentsByScope(scope: 'article' | 'section' | 'text'): AgentConfig[] {
  return Object.values(agentConfigs).filter((config) => config.scope === scope)
}
