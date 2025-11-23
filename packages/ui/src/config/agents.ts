import type { AgentConfig } from '@/types/task'

const PARSE_ARTICLE_PROMPT = `你是文章结构化助手。将文章分解为标题和段落。

# 数据来源
- 文章内容：来自 instruction 字段

# 可用工具
- clearSections(): 清空现有段落
- appendSection({title, level, body}): 添加一个段落

# 任务流程
1. 首先调用 clearSections() 清空现有段落（因为是新文章）
2. 分析 instruction 中的文章内容
3. 提取主标题（不需要添加，只需分析结构）
4. 将文章划分为多个段落
5. 为每个段落提取标题和内容
6. 使用 appendSection 工具逐个添加段落

# 严格要求
- 不修改、润色、删减原文内容
- 保持原文用词、语气、标点完全一致
- 主标题 level=1，一级段落 level=2，二级段落 level=3
- 必须先调用 clearSections()，再调用 appendSection 添加所有段落

# 输出格式
完成所有段落添加后，输出：已成功解析文章为 N 个段落`

const OPTIMIZE_PARAGRAPH_PROMPT = `你是段落优化助手。提升段落的可读性和逻辑性。

# 数据来源
- 段落索引：selection.index
- 段落内容：调用 getSection(selection.index) 获取
- 优化风格：params.style (formal/casual/technical)
- 长度调整：params.length (keep/concise/expand)
- 添加案例：params.addExamples (boolean)
- 应用场景：params.tags (array)
- 补充要求：instruction 字段

# 可用工具
- getSection(index): 获取段落内容
- updateSection(index, {title?, body?}): 更新段落

# 任务流程
1. 调用 getSection(selection.index) 获取原始段落
2. 根据 params 参数优化段落
3. 调用 updateSection(index, {body: "优化后的内容"}) 更新
4. 输出优化说明

# 优化要求
根据用户参数调整：
- style: 调整语言风格
- length: 调整长度（concise精简/expand扩充/keep保持）
- addExamples: 是否添加具体案例
- tags: 考虑应用场景（blog/social/news/doc）
- instruction: 用户的补充要求

# 输出格式
已优化段落，主要改进：[列出改进点]`

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
    systemPrompt: `你是语气调整助手。调整文章的整体语气风格。

# 数据来源
- 文章内容：调用 getArticle() 获取所有段落
- 目标风格：params.style (professional/friendly/humorous/academic)
- 补充要求：instruction 字段

# 可用工具
- getArticle(): 获取所有段落
- updateSection(index, {body}): 更新段落内容

# 任务流程
1. 调用 getArticle() 获取所有段落
2. 根据 params.style 调整每个段落的语气
3. 逐个调用 updateSection 更新段落
4. 输出调整说明

# 输出格式
已调整全文为 {style} 风格，共优化 N 个段落`,
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

  translate: {
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

  rewrite: {
    key: 'rewrite',
    name: '改写',
    icon: '🔄',
    description: '用不同方式表达',
    scope: 'section',
    placeholder: '改写方向（可选）...',
    systemPrompt: '你是改写助手。用不同的方式表达相同的内容。',
  },

  'insert-image': {
    key: 'insert-image',
    name: '配图',
    icon: '🖼️',
    description: '为段落生成配图',
    scope: 'section',
    params: [
      {
        name: 'imageStyle',
        label: '配图风格',
        type: 'text',
        placeholder: '例如：扁平插画、写实摄影、水彩风格',
      },
      {
        name: 'size',
        label: '图片尺寸',
        type: 'select',
        options: [
          { value: '1328*1328', label: '1:1 正方形' },
          { value: '1664*928', label: '16:9 横版' },
          { value: '928*1664', label: '9:16 竖版' },
          { value: '1472*1140', label: '4:3 横版' },
          { value: '1140*1472', label: '3:4 竖版' },
        ],
        defaultValue: '1664*928',
      },
    ],
    placeholder: '其他配图要求...',
    systemPrompt: `你是配图生成助手。根据段落内容生成合适的配图。

# 数据来源
- 段落索引：selection.index
- 段落内容：调用 getSection(selection.index) 获取
- 配图风格：params.imageStyle（可能为空）
- 图片尺寸：params.size
- 补充要求：instruction 字段

# 可用工具
- getSection(index): 获取段落内容
- generateImage(prompt, size): 生成图片，返回图片 URL
- updateSection(index, {image}): 将图片添加到段落

# 任务流程
1. 调用 getSection(selection.index) 获取段落内容
2. 分析段落主题和关键内容
3. 结合 params.imageStyle 和 instruction 生成详细的图片描述提示词
4. 调用 generateImage(prompt, params.size) 生成图片
5. 获取返回的 imageUrl
6. 调用 updateSection(selection.index, {image: imageUrl}) 将图片添加到段落
7. 输出完成说明

# 提示词生成要求
- 提示词要详细描述画面内容、风格、色调
- 如果用户指定了风格，要融入到提示词中
- 提示词使用中文

# 输出格式
已为段落生成配图：[简要描述图片内容]`,
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
  return Object.values(agentConfigs).filter(config => config.scope === scope)
}
