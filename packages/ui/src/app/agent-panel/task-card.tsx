import { useState, useCallback } from 'react'
import type { AgentMessage } from '@wepress/agent-query'
import type { Task } from '@/types/task'
import { getStatus, getAgentConfig, getScopeDisplay, getTimestamp } from './task-helpers'
import { MessageList } from './messages/message-list'
import { TodoListPanel } from './messages/todo-list-panel'

type TaskCardProps = {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const status = getStatus(task)
  const agentConfig = getAgentConfig(task)
  const scopeDisplay = getScopeDisplay(task)
  const timestamp = getTimestamp(task)

  // Maintain tool results mapping
  const [toolResults, setToolResults] = useState<Record<string, AgentMessage & { type: 'tool_result' }>>({})

  const handleToolResultUpdate = useCallback((toolCallId: string, result: AgentMessage & { type: 'tool_result' }) => {
    setToolResults(prev => ({
      ...prev,
      [toolCallId]: result,
    }))
  }, [])

  const statusConfig = {
    completed: { icon: '✅', color: 'text-green-600' },
    running: { icon: '🔄', color: 'text-blue-600' },
    failed: { icon: '❌', color: 'text-red-600' },
    aborted: { icon: '⛔', color: 'text-gray-500' },
  }

  const config = statusConfig[status]

  return (
    <div className="mx-3 mb-3 border-b border-gray-200 pb-3 last:border-b-0">
      {/* Header */}
      <div className="mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">{agentConfig.icon}</span>
          <span className="text-sm font-medium text-gray-900">{agentConfig.name}</span>
          <span className={`text-xs ${config.color}`}>{config.icon}</span>
          <span className="text-xs text-gray-500">· {scopeDisplay}</span>
          <span className="text-xs text-gray-400">· {timestamp}</span>
        </div>
      </div>

      {/* Messages */}
      <MessageList messages={task.messages} toolResults={toolResults} onToolResultUpdate={handleToolResultUpdate} />

      {/* TodoList */}
      {task.todoList && <TodoListPanel todoList={task.todoList} />}
    </div>
  )
}
