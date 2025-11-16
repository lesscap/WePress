import { nanoid } from 'nanoid'
import type {
  AbortMessage,
  AgentMessage,
  AgentQuery,
  AgentResult,
  QueryOptions,
  QueryPromptMeta,
  TodoListMessage,
  ToolCallMessage,
} from '../../types'
import { buildToolResultPrompt } from '../../utils/prompt-tools'
import { formatTodoListForPrompt, getTodoList, hasUncompletedTodos } from '../../utils/todo-tools'
import { checkHasError, extractFinalText, serializeTodoState } from './helpers'
import { createToolResultMessages } from './message-factory'
import { executeToolCalls } from './tool-executor'

/**
 * Auto-tool stream generator
 * Main loop for multi-round tool execution
 */
export async function* createAutoToolStream(
  createQuery: (prompt: string, meta?: QueryPromptMeta) => AgentQuery,
  options: {
    prompt: string
    sessionId: string
    tools: NonNullable<QueryOptions['tools']>
    systemPrompt?: string
    onToolCall: NonNullable<QueryOptions['onToolCall']>
    maxRounds: number
    enableTodo?: boolean
    signal?: AbortController
  },
  allMessages: AgentMessage[],
): AsyncGenerator<AgentMessage, AgentResult, void> {
  const startTime = Date.now()
  let round = 0
  let _workRound = 0
  let currentPrompt = options.prompt
  let meta: AgentResult['meta'] | undefined
  const totalUsage = {
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
  }

  // State change detection: exit if TODO state unchanged for N rounds
  let unchangedCount = 0
  let previousTodoState = serializeTodoState(options.sessionId)
  let streamAborted = false

  while (true) {
    // Check abort signal
    if (options.signal?.signal.aborted) {
      const abortMessage: AbortMessage = {
        type: 'abort',
        messageId: nanoid(),
        conversationId: options.sessionId,
        content: { reason: 'Request aborted by user' },
        timestamp: new Date().toISOString(),
      }
      allMessages.push(abortMessage)
      yield abortMessage
      break
    }

    // Create query for this round
    // First round: no meta; subsequent rounds: tool_result meta for history compression
    const roundQuery = createQuery(currentPrompt, round > 0 ? { type: 'tool_result' } : undefined)

    // Collect non-delta messages and tool_call messages
    const nonDeltaMessages: AgentMessage[] = []
    const toolCallMessages: ToolCallMessage[] = []

    // Stream messages from this round
    for await (const message of roundQuery.stream) {
      allMessages.push(message)

      if (message.type === 'abort') {
        streamAborted = true
      }

      // Track meta
      if (message.type === 'meta') {
        meta = message.content
      }

      // Accumulate usage
      if (message.type === 'usage') {
        totalUsage.inputTokens += message.content.promptTokens
        totalUsage.outputTokens += message.content.completionTokens
        totalUsage.totalTokens += message.content.totalTokens
      }

      // Collect tool_call messages
      if (message.type === 'tool_call') {
        toolCallMessages.push(message)
        const isTodo = /^todo_/.test(message.content.name)
        if (!isTodo) {
          yield message // Yield non-TODO tool calls immediately
        }
        continue
      }

      // Text messages: delta ones yield immediately, complete ones buffer
      if (message.type === 'text') {
        if (message.delta) {
          yield message // Real-time streaming
        } else {
          nonDeltaMessages.push(message) // Buffer for decision
        }
      } else {
        yield message // Non-text messages: yield immediately
      }
    }

    if (streamAborted) {
      break
    }

    // If no tool calls, check TODO status
    if (toolCallMessages.length === 0) {
      // If TODO enabled and uncompleted tasks exist, force next round with reminder
      if (options.enableTodo && hasUncompletedTodos(options.sessionId)) {
        yield* nonDeltaMessages

        const todoList = getTodoList(options.sessionId)
        if (todoList) {
          const todoContext = formatTodoListForPrompt(todoList)
          currentPrompt = `Note: The following tasks are incomplete:

${todoContext}

Please continue processing, or call todo_update to mark as completed if already done.`
          round++
          continue
        }
      }

      // No TODO or all completed: yield buffered text and done
      yield* nonDeltaMessages
      break
    }

    // Has tool calls: execute tools

    // Convert ToolCallMessage to ToolCall
    const toolCalls = toolCallMessages.map((msg) => ({
      toolCallId: msg.content.toolCallId,
      name: msg.content.name,
      arguments: msg.content.arguments,
    }))

    // Execute tools
    const toolResults = await executeToolCalls(toolCalls, options.sessionId, options.onToolCall)

    // Check if any TODO tools were called
    const hasTodoToolCall = toolCalls.some(
      (call) => call.name === 'todo_create' || call.name === 'todo_add' || call.name === 'todo_update',
    )

    // Emit tool result messages
    const toolResultMessages = createToolResultMessages(toolResults, options.sessionId)
    for (const msg of toolResultMessages) {
      allMessages.push(msg)
      yield msg
    }

    // If TODO tools called, emit TodoListMessage
    if (hasTodoToolCall) {
      const currentTodoList = getTodoList(options.sessionId)
      if (currentTodoList) {
        const todoMessage: TodoListMessage = {
          type: 'todolist',
          messageId: nanoid(),
          conversationId: options.sessionId,
          content: {
            todoList: currentTodoList,
            raw: '',
          },
          timestamp: new Date().toISOString(),
        }
        allMessages.push(todoMessage)
        yield todoMessage
      }
    }

    // Check TODO state change
    const currentTodoState = serializeTodoState(options.sessionId)
    if (currentTodoState === previousTodoState) {
      unchangedCount++
      if (unchangedCount >= options.maxRounds) {
        const abortMessage: AbortMessage = {
          type: 'abort',
          messageId: nanoid(),
          conversationId: options.sessionId,
          content: {
            reason: `TODO state unchanged for ${unchangedCount} rounds, loop detected, auto-terminated`,
          },
          timestamp: new Date().toISOString(),
        }
        allMessages.push(abortMessage)
        yield abortMessage
        break
      }
    } else {
      unchangedCount = 0
      previousTodoState = currentTodoState
    }

    // Build next prompt with tool results
    currentPrompt = buildToolResultPrompt(toolResults, {
      sessionId: options.sessionId,
      enableTodo: options.enableTodo,
    })

    // Check if all tool calls are TODO tools
    const allTodoTools = toolCalls.every((call) => call.name.startsWith('todo_'))

    round++
    if (!allTodoTools) {
      _workRound++
    }
  }

  // Build final result
  const duration = Date.now() - startTime
  const result: AgentResult = {
    sessionId: options.sessionId,
    messageId: allMessages[allMessages.length - 1]?.messageId || '',
    meta,
    messageCount: allMessages.length,
    finalText: extractFinalText(allMessages),
    hasError: checkHasError(allMessages),
    usage: totalUsage.totalTokens > 0 ? totalUsage : undefined,
    duration,
  }

  return result
}
