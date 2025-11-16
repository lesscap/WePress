import { nanoid } from 'nanoid'
import type { AgentMessage, AgentQuery, AgentResult, QueryOptions, QueryPromptMeta } from '../types'
import { AGENT_MODE_SYSTEM_PROMPT } from '../utils/agent-prompt'
import { TODO_TOOLS } from '../utils/todo-tools'
import { createAutoToolStream } from './auto-tools'
import { convertError, convertToolResult } from './tool-result-converter'

/**
 * Consume stream and return result
 */
async function consumeStream(
  stream: AsyncGenerator<AgentMessage, AgentResult, void>,
  messages: AgentMessage[],
  sessionId: string,
): Promise<AgentResult> {
  try {
    let next = await stream.next()
    while (!next.done) {
      next = await stream.next()
    }
    return next.value
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error
    }
    const result = buildResultFromMessages(messages, sessionId)
    result.hasError = true
    return result
  }
}

/**
 * Create basic agent query
 */
function createAgentQuery(options: QueryOptions): AgentQuery {
  const sessionId = options.sessionId || nanoid()
  const abortController = new AbortController()

  const messages: AgentMessage[] = []
  let streamConsumed = false
  let cachedResult: AgentResult | undefined

  const stream = createMessageStream(
    {
      ...options,
      sessionId,
      signal: options.signal ?? abortController.signal,
    },
    messages,
  )

  const ensureConsumed = async () => {
    if (!streamConsumed) {
      cachedResult = await consumeStream(stream, messages, sessionId)
      streamConsumed = true
    }
  }

  return {
    sessionId,
    stream,

    async interrupt() {
      abortController.abort()
    },

    async getResult() {
      if (cachedResult) {
        return cachedResult
      }
      await ensureConsumed()
      return cachedResult!
    },

    async getAllMessages() {
      await ensureConsumed()
      return [...messages]
    },
  }
}

/**
 * Create message stream (async generator)
 */
async function* createMessageStream(
  options: QueryOptions & { sessionId: string; signal: AbortSignal },
  messages: AgentMessage[],
): AsyncGenerator<AgentMessage, AgentResult, void> {
  const startTime = Date.now()
  let meta: AgentResult['meta'] | undefined
  let usage: AgentResult['usage'] | undefined

  const stream = options.provider.send({
    prompt: options.prompt,
    meta: options.meta,
    sessionId: options.sessionId,
    attachments: options.attachments,
    signal: options.signal,
    tools: options.tools,
    systemPrompt: options.systemPrompt,
  })

  for await (const message of stream) {
    messages.push(message)

    if (message.type === 'meta') {
      meta = message.content
    }

    if (message.type === 'usage') {
      usage = {
        inputTokens: message.content.promptTokens,
        outputTokens: message.content.completionTokens,
        totalTokens: message.content.totalTokens,
      }
    }

    // Handle tool calls
    if (message.type === 'tool_call' && options.onToolCall) {
      const toolResultMsg = await handleToolCall(message, options.onToolCall)
      messages.push(toolResultMsg)
      yield toolResultMsg
    }

    yield message
  }

  const duration = Date.now() - startTime
  return buildResultFromMessages(messages, options.sessionId, meta, duration, usage)
}

/**
 * Handle tool call and return result message
 */
async function handleToolCall(
  message: AgentMessage & { type: 'tool_call' },
  onToolCall: NonNullable<QueryOptions['onToolCall']>,
): Promise<AgentMessage> {
  const call = {
    toolCallId: message.content.toolCallId,
    name: message.content.name,
    arguments: message.content.arguments,
  }

  let internalResult: ReturnType<typeof convertToolResult>
  try {
    const userResult = await onToolCall(call)
    internalResult = convertToolResult(call, userResult)
  } catch (error) {
    internalResult = convertError(call, error)
  }

  return {
    type: 'tool_result',
    messageId: nanoid(),
    conversationId: message.conversationId,
    content: internalResult,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Build result summary from messages
 */
function buildResultFromMessages(
  messages: AgentMessage[],
  sessionId: string,
  meta?: AgentResult['meta'],
  duration?: number,
  usage?: AgentResult['usage'],
): AgentResult {
  let finalText = ''
  let hasError = false
  let lastMessageId = ''

  for (const msg of messages) {
    lastMessageId = msg.messageId

    if (msg.type === 'text') {
      if (!msg.delta) {
        finalText = msg.content.text
      }
      if (msg.content.status === 'ERROR') {
        hasError = true
      }
    }

    if (msg.type === 'error') {
      hasError = true
    }
  }

  return {
    sessionId,
    messageId: lastMessageId,
    meta,
    messageCount: messages.length,
    finalText,
    hasError,
    usage,
    duration,
  }
}

/**
 * Create agent query with automatic tool calling
 */
function createAutoToolsQuery(options: QueryOptions): AgentQuery {
  const sessionId = options.sessionId || nanoid()
  const abortController = new AbortController()
  const maxRounds = options.maxToolRounds || 7
  const tools = options.tools || []
  const onToolCall = options.onToolCall

  if (!onToolCall) {
    throw new Error('onToolCall is required for automatic tool calling')
  }

  const allMessages: AgentMessage[] = []
  let streamConsumed = false
  let cachedResult: AgentResult | undefined

  // Build enhanced system prompt for agent mode
  const systemPromptParts: string[] = []

  if (options.enableTodo) {
    systemPromptParts.push(AGENT_MODE_SYSTEM_PROMPT)
  }

  if (options.systemPrompt) {
    systemPromptParts.push(options.systemPrompt)
  }

  const enhancedSystemPrompt = systemPromptParts.join('\n\n---\n\n')

  // Create query factory for auto-tool stream
  const createQuery = (prompt: string, meta?: QueryPromptMeta): AgentQuery => {
    return createAgentQuery({
      ...options,
      prompt,
      sessionId,
      signal: abortController.signal,
      meta,
      systemPrompt: enhancedSystemPrompt || undefined,
      onToolCall: undefined, // Tool execution handled by auto-tools layer
    })
  }

  // Create auto-tool stream
  const stream = createAutoToolStream(
    createQuery,
    {
      prompt: options.prompt,
      sessionId,
      tools,
      systemPrompt: enhancedSystemPrompt || undefined,
      onToolCall,
      maxRounds,
      enableTodo: options.enableTodo,
      signal: abortController,
    },
    allMessages,
  )

  const ensureConsumed = async () => {
    if (!streamConsumed) {
      cachedResult = await consumeStream(stream, allMessages, sessionId)
      streamConsumed = true
    }
  }

  return {
    sessionId,
    stream,

    async interrupt() {
      abortController.abort()
    },

    async getResult() {
      if (cachedResult) {
        return cachedResult
      }
      await ensureConsumed()
      return cachedResult!
    },

    async getAllMessages() {
      await ensureConsumed()
      return [...allMessages]
    },
  }
}

/**
 * Main public API
 * Automatically routes to basic or agent mode implementation
 */
export function agentQuery(options: QueryOptions): AgentQuery {
  const isAgentMode = options.agentMode || options.autoTools

  if (isAgentMode && options.onToolCall) {
    // Inject TODO tools if enabled
    const tools = options.tools || []
    const enhancedTools = options.enableTodo ? [...TODO_TOOLS, ...tools] : tools

    return createAutoToolsQuery({
      ...options,
      tools: enhancedTools,
    })
  }

  // Basic mode
  return createAgentQuery(options)
}
