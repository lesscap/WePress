import type { ToolDefinition } from '../../types'

const TOOL_CALL_FORMAT_INSTRUCTION = `Call format: <tool_call>{"name":"tool_name","arguments":{...}}</tool_call>
Note: Wait for results, don't fabricate; multiple calls allowed, wrap independently`.trim()

/**
 * Build tools description text for LLM
 * Converts tool definitions to LLM-readable format
 *
 * Strategy:
 * - If tool provides examples, use example mode (saves tokens)
 * - Otherwise use full schema mode (backward compatible)
 */
export function buildToolsDescription(tools: ToolDefinition[]): string {
  if (tools.length === 0) {
    return ''
  }

  const toolDocs = tools
    .map((tool) => {
      // Example mode if examples provided
      if (tool.examples && tool.examples.length > 0) {
        const exampleLines = tool.examples.map((ex) => `  ${ex}`).join('\n')
        const notes = tool.notes ? `\n  ${tool.notes}` : ''
        return `- ${tool.name} | ${tool.description}\n${exampleLines}${notes}`
      }

      // Schema mode (backward compatible)
      const params = JSON.stringify(tool.parameters, null, 2)
      return `- **${tool.name}**: ${tool.description}
  Parameters: ${params}`
    })
    .join('\n\n')

  return `You can use the following tools to help answer questions:

${toolDocs}

${TOOL_CALL_FORMAT_INSTRUCTION}`.trim()
}

/**
 * Build complete system prompt
 * Combines custom systemPrompt and tool descriptions
 */
export function buildSystemPrompt(tools: ToolDefinition[], systemPrompt?: string): string {
  const parts: string[] = []

  if (systemPrompt) {
    parts.push(systemPrompt)
  }

  if (tools.length > 0) {
    parts.push(buildToolsDescription(tools))
  }

  return parts.join('\n\n')
}
