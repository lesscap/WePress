/**
 * Agent Query API Types
 */

/**
 * Meta information for message compression
 * Used to mark different types of prompts for provider-side optimization
 */
export type QueryPromptMeta = {
  /** Type of the prompt, e.g., 'tool_result' for tool execution results */
  type?: string
}

/**
 * Provider options (platform-agnostic)
 */
export type ProviderOptions = {
  prompt: string
  sessionId: string
  attachments?: Attachment[]
  signal?: AbortSignal
  meta?: QueryPromptMeta
  /** Tool definitions (for providers that support tool calling) */
  tools?: ToolDefinition[]
  /**
   * System prompt for the conversation
   * Converted to system role message in OpenAI-compatible APIs
   */
  systemPrompt?: string
}

/**
 * Agent Provider interface
 * Provides methods for sending messages and managing sessions
 */
export type AgentProvider = {
  /**
   * Send a message and return a stream of AgentMessage
   */
  send: (options: ProviderOptions) => AsyncGenerator<AgentMessage, void, void>

  /**
   * Clear session history
   */
  clear: (sessionId: string) => void
}

/**
 * Query options (platform-agnostic)
 */
export type QueryOptions = {
  /** User prompt */
  prompt: string

  /** Session ID (auto-generated if not provided) */
  sessionId?: string

  /** Attachments */
  attachments?: Attachment[]

  /** Provider implementation (required) */
  provider: AgentProvider

  /** Custom tool definitions */
  tools?: ToolDefinition[]

  /**
   * System prompt for the conversation
   * Can include tool usage guidelines, constraints, or other system-level instructions
   */
  systemPrompt?: string

  /** Tool call callback */
  onToolCall?: (call: ToolCall) => Promise<ToolResult>

  /**
   * Enable agent mode with automatic task management
   * Agent mode includes:
   * - Automatic tool calling
   * - TODO-based task tracking
   * - Multi-round execution
   * @default false
   */
  agentMode?: boolean

  /**
   * @deprecated Use agentMode instead
   * Enable automatic tool calling (default: false)
   */
  autoTools?: boolean

  /** Maximum tool calling rounds for agent mode (default: 7) */
  maxToolRounds?: number

  /**
   * Enable TODO task tracking in agent mode
   * Only effective when agentMode is true
   * @default false
   */
  enableTodo?: boolean

  /** Abort signal for cancellation (internal use) */
  signal?: AbortSignal

  /** Meta information for provider (internal use, used for message compression) */
  meta?: QueryPromptMeta
}

/**
 * Attachment types
 */
export type Attachment = {
  type: 'image' | 'file' | 'url'
  url?: string
  data?: string // base64
  filename?: string
  mimeType?: string
  size?: number
}

/**
 * Tool definition (OpenAI Function Calling format)
 */
export type ToolDefinition = {
  name: string
  description: string
  parameters: {
    type: 'object'
    properties: Record<string, JSONSchemaProperty>
    required?: string[]
  }
  /**
   * Call examples for prompt optimization
   * If provided, will be used in prompt instead of full schema
   * @example ['<tool_call>{"name":"get_weather","arguments":{"city":"北京"}}</tool_call>']
   */
  examples?: string[]
  /**
   * Additional notes for tool usage
   * Displayed after examples when using example mode
   */
  notes?: string
}

/**
 * JSON Schema property definition
 */
export type JSONSchemaProperty = {
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object'
  description?: string
  enum?: (string | number)[]
  items?: JSONSchemaProperty
  properties?: Record<string, JSONSchemaProperty>
  oneOf?: JSONSchemaProperty[]
  anyOf?: JSONSchemaProperty[]
  allOf?: JSONSchemaProperty[]
  [key: string]: unknown
}

/**
 * Tool call request (from Agent)
 */
export type ToolCall = {
  toolCallId: string
  name: string
  arguments: Record<string, unknown>
}

/**
 * Tool execution result (from client)
 * 成功时返回 { result: xxx }
 * 错误时返回 { error: message } 或直接 throw Error
 */
export type ToolResult =
  | {
      result: unknown
      error?: never
    }
  | {
      result?: never
      error: string
    }

/**
 * Agent Query result object
 */
export type AgentQuery = {
  readonly sessionId: string
  stream: AsyncGenerator<AgentMessage, AgentResult, void>
  interrupt(): Promise<void>
  getResult(): Promise<AgentResult>
  getAllMessages(): Promise<AgentMessage[]>
}

/**
 * Message types (streamed events)
 */
export type AgentMessage =
  | TextMessage
  | ToolCallMessage
  | ToolResultMessage
  | MetaMessage
  | ErrorMessage
  | UsageMessage
  | TodoListMessage
  | AbortMessage

export type TextMessage = {
  type: 'text'
  messageId: string
  conversationId: string
  content: {
    text: string
    status: 'DOING' | 'DONE' | 'ERROR'
  }
  delta: boolean
  timestamp: string
}

export type ToolCallMessage = {
  type: 'tool_call'
  messageId: string
  conversationId: string
  content: {
    toolCallId: string
    name: string
    arguments: Record<string, unknown>
  }
  timestamp: string
}

export type ToolResultMessage = {
  type: 'tool_result'
  messageId: string
  conversationId: string
  content: {
    toolCallId: string
    result?: unknown
    isError?: boolean
    error?: string
  }
  timestamp: string
}

export type MetaMessage = {
  type: 'meta'
  messageId: string
  conversationId: string
  content: {
    key: string
    name: string
    llm?: string
    [key: string]: unknown
  }
  timestamp: string
}

export type ErrorMessage = {
  type: 'error'
  messageId: string
  conversationId: string
  content: {
    error: string
    code?: string
    details?: unknown
  }
  timestamp: string
}

export type UsageMessage = {
  type: 'usage'
  messageId: string
  conversationId: string
  content: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  timestamp: string
}

/**
 * TODO item status
 */
export type TodoStatus = 'pending' | 'completed' | 'deleted'

/**
 * Single TODO item
 */
export type TodoItem = {
  status: TodoStatus
  content: string
  result?: string // 任务执行结果（可选）
}

/**
 * TODO list structure
 */
export type TodoList = {
  items: TodoItem[]
  version: number
}

/**
 * TODO list message (streamed from LLM)
 */
export type TodoListMessage = {
  type: 'todolist'
  messageId: string
  conversationId: string
  content: {
    todoList: TodoList
    raw: string
  }
  timestamp: string
}

export type AbortMessage = {
  type: 'abort'
  messageId: string
  conversationId: string
  content: {
    reason?: string
  }
  timestamp: string
}

/**
 * Final result summary
 */
export type AgentResult = {
  sessionId: string
  messageId: string
  meta?: {
    key: string
    name: string
    llm?: string
  }
  messageCount: number
  finalText: string
  hasError: boolean
  usage?: {
    inputTokens?: number
    outputTokens?: number
    totalTokens?: number
  }
  duration?: number
}
