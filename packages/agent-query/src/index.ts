/**
 * @wepress/agent-query
 * AI agent query runtime for WePress
 */

// Main API
export { agentQuery } from './query'

// Provider
export { createAIProxyProvider } from './provider/ai-proxy'
export type { AIProxyProviderConfig } from './provider/ai-proxy'

// Types
export type {
  AgentMessage,
  AgentQuery,
  AgentResult,
  QueryOptions,
  ToolCall,
  ToolDefinition,
  ToolResult,
  TextMessage,
  ToolCallMessage,
  ToolResultMessage,
  TodoListMessage,
  ErrorMessage,
  UsageMessage,
  AbortMessage,
  MetaMessage,
  TodoItem,
  TodoList,
  TodoStatus,
  AgentProvider,
  JSONSchemaProperty,
  Attachment,
} from './types'

// Utils (for advanced usage)
export { TODO_TOOLS, getTodoList, clearTodoList } from './utils/todo-tools'
export { AGENT_MODE_SYSTEM_PROMPT } from './utils/agent-prompt'
