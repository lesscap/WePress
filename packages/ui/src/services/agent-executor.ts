import { agentQuery, createAIProxyProvider } from '@wepress/agent-query'
import type { AgentQuery, ToolCall, ToolResult } from '@wepress/agent-query'
import type { TaskRequest } from '@/types/task'
import type { EditorSelection } from '@/types/editor'
import { getAgentConfig } from '@/config/agents'

export type ExecuteAgentOptions = {
  request: TaskRequest
  onToolCall: (call: ToolCall) => Promise<ToolResult>
}

/**
 * Serialize selection info - simplified version with key information only
 */
function serializeSelection(scope: EditorSelection): object {
  if (scope.type === 'none') {
    return { type: 'article' }
  }

  if (scope.type === 'section') {
    return {
      type: 'section',
      index: scope.sectionIndex,
      id: scope.sectionId,
      title: scope.sectionTitle,
    }
  }

  if (scope.type === 'text') {
    return {
      type: 'text',
      range: scope.range,
      // Selected text can be retrieved via getSelectedText() tool
    }
  }

  return { type: 'unknown' }
}

/**
 * Create agent query - unified serialization for all parameters
 */
export function executeAgent(options: ExecuteAgentOptions): AgentQuery {
  const { request, onToolCall } = options
  const config = getAgentConfig(request.agentKey)

  // Unified serialization of user context
  const userContext = {
    selection: serializeSelection(request.scope),
    params: request.params,
    instruction: request.instruction || null,
  }

  // Build prompt - unified format
  const prompt = `用户上下文信息：
\`\`\`json
${JSON.stringify(userContext, null, 2)}
\`\`\`

请根据以上信息和系统提示完成任务。`

  return agentQuery({
    prompt,
    systemPrompt: config.systemPrompt,
    provider: createAIProxyProvider({
      model: 'qwen-plus',
      baseUrl: '/api/chat/completions',
    }),
    agentMode: true,
    enableTodo: true,
    onToolCall,
  })
}
