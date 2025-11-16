# Agent System Design

## Overview

WePress 编辑器采用 Agent 驱动的文章优化系统，而非传统的聊天对话模式。用户通过选择不同的作用域（文章/段落/文本），调用相应的 Agent 来执行特定任务。

## Core Concepts

### 1. Three-Level Scope

- **Article Level**: 作用于整篇文章
- **Section Level**: 作用于选中的段落
- **Text Level**: 作用于选中的文本片段

### 2. Agent + Tools Pattern

Agent 执行时可以调用 Tools 获取上下文信息：
- `getArticleOutline()`: 获取文章结构大纲
- `getSectionContent(index)`: 获取指定段落内容
- `getParentSection(index)`: 获取父级段落
- `getSiblingSections(index)`: 获取同级段落
- `getChildSections(index)`: 获取子段落

### 3. Task Queue

任务以队列形式管理：
- 任务 = 选区快照 + Agent + 参数
- 支持队列、执行中、等待输入、已完成、已中止等状态
- 用户可随时 Abort 或 Continue（补充上下文）

## Data Models

### Article Structure

```typescript
type Section = {
  id: string
  title: string
  level: 1 | 2 | 3 | 4 | 5 | 6  // h1-h6
  body: string  // markdown format
}

type Article = {
  sections: Section[]
}
```

**设计决策**: 采用线性结构而非树形结构
- 符合 Markdown/HTML 原生语义
- 简化模板套用逻辑
- LLM 更容易生成
- 层级关系可通过 level 推导

### Selection State

```typescript
type EditorSelection =
  | { type: 'none' }
  | { type: 'section', sectionIndex: number, sectionId: string, sectionTitle: string }
  | { type: 'text', sectionIndex: number, sectionId: string, range: { start: number, end: number }, selectedText: string }
```

### Task

```typescript
type Task = {
  id: string
  agent: string
  agentName: string
  agentIcon: string
  context: {
    scope: 'article' | 'section' | 'text'
    target: TargetSnapshot
  }
  params?: Record<string, any>
  status: 'queued' | 'running' | 'waiting_input' | 'completed' | 'failed' | 'aborted'
  toolCalls: ToolCall[]
  result?: any
  error?: string
  createdAt: number
  completedAt?: number
}

type TargetSnapshot = {
  sectionIndex?: number
  sectionId?: string
  sectionTitle?: string
  textRange?: { start: number, end: number }
  selectedText?: string
}

type ToolCall = {
  id: string
  tool: string
  status: 'running' | 'completed' | 'failed'
  displayName: string  // 人类可读的描述，如 "正在阅读父级段落..."
  result?: any
  timestamp: number
}
```

### Agent Definition

```typescript
type AgentDef = {
  id: string
  name: string
  icon: string
  description: string
  scope: 'article' | 'section' | 'text'
}
```

**Predefined Agents**:

Article Level:
- `parse-article` - 解析结构
- `adjust-tone` - 调整语气
- `seo-optimize` - SEO优化

Section Level:
- `optimize-paragraph` - 优化段落
- `insert-image` - 配图
- `expand-content` - 扩展内容

Text Level:
- `polish-text` - 润色
- `translate` - 翻译
- `rewrite` - 改写

## UI Layout

```
┌────────────────────┬─────────────────┐
│                    │ 📍 当前选区      │
│                    ├─────────────────┤
│                    │ 🚀 快速操作      │
│   Article Editor   │ [✨优化] [🖼️配图]│
│                    │ [➕扩展] [更多]  │
│   (Three-column    ├─────────────────┤
│    layout)         │ 🔄 执行中        │
│                    │ Task details... │
│                    ├─────────────────┤
│                    │ 📋 任务队列      │
│                    │ - 队列中 (2)    │
│                    │ - 已完成 (1)    │
└────────────────────┴─────────────────┘
```

## Interaction Flow

### Scenario: Optimize Paragraph

```
用户操作              编辑器状态           右侧面板显示
────────────────────────────────────────────────────────
点击段落2     →      段落2高亮     →    📝 第2段：早期探索
                                        🚀 快速操作
                                        [✨优化段落] ...

点击"优化"    →      锁定选区      →    🔄 执行中
                                        ✅ 已获取文章结构
                                        ✅ 已阅读父级段落《历史背景》
                                        🔄 正在生成优化内容...

完成         →      保持选区      →    ✅ 优化完成
                                        [预览结果]
                                        [应用] [重试] [放弃]
```

### Tool Call Display

LLM 调用的 tools 应展示为人类可读的文本：

```
✅ 已获取文章结构
✅ 已阅读父级段落《历史背景》
✅ 已参考 1 个同级段落
🔄 正在生成优化内容...
```

而非技术性的函数调用：
```
❌ getArticleOutline()
❌ getParentSection(3)
❌ getSiblingSections(3)
```

## Component Structure

```
packages/ui/src/apps/web/pages/editor/
├── index.tsx                 # 主页面，三栏布局
├── components/
│   ├── ArticleEditor/        # 中间：编辑区
│   │   ├── index.tsx
│   │   ├── SectionBlock.tsx  # 单个段落
│   │   └── QuickActionMenu.tsx  # 悬停快捷菜单
│   │
│   └── AgentPanel/           # 右侧：Agent 面板
│       ├── index.tsx         # 主面板
│       ├── ScopeIndicator.tsx  # 面包屑（显示当前选区）
│       ├── QuickActions.tsx  # 快速操作按钮
│       ├── TaskQueue.tsx     # 任务队列
│       ├── TaskItem.tsx      # 单个任务
│       ├── TaskExecuting.tsx # 执行中的任务详情
│       └── TaskCompleted.tsx # 已完成的任务
```

## API Design

### Execute Agent

```
POST /api/agents/execute

Request:
{
  agent: string
  context: {
    scope: 'article' | 'section' | 'text'
    target: TargetSnapshot
  }
  params?: Record<string, any>
}

Response: SSE Stream
data: {"type": "tool_call", "tool": "getArticleOutline", "status": "running", "displayName": "正在获取文章结构..."}
data: {"type": "tool_call", "tool": "getArticleOutline", "status": "completed", "displayName": "已获取文章结构"}
data: {"type": "result", "data": {...}}
data: {"type": "done"}
```

### Abort Task

```
POST /api/agents/abort
{
  taskId: string
}
```

### Continue Task

```
POST /api/agents/continue
{
  taskId: string
  additionalContext: string
}
```

## Implementation Phases

### Phase 1: UI with Mock Data ⬅️ Current
- Create minimal type definitions
- Build component structure
- Use mock data for demonstration

### Phase 2: State Management
- Integrate Zustand
- Implement selection state
- Implement task queue state

### Phase 3: Backend Integration
- Implement agent execution API
- Implement Tools system
- Connect SSE streaming

### Phase 4: Polish
- Styling and animations
- Error handling
- Edge cases

## Design Principles

1. **简洁优先**: 只创建当前需要的，避免过度设计
2. **渐进增强**: 先 UI，再 state，最后后端集成
3. **用户体验**: 技术细节转化为可读文本，增加专业感
4. **任务为中心**: 不是聊天，而是任务执行和管理
