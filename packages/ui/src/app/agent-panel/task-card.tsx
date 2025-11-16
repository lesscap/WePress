import { useState, useEffect } from 'react'
import type { Task } from '@/types/task'
import {
  getStatus,
  getAgentConfig,
  getStreamingOutput,
  getFinalText,
  getToolCalls,
  getScopeDisplay,
  getTimestamp,
} from './task-helpers'

type TaskCardProps = {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const status = getStatus(task)
  const agentConfig = getAgentConfig(task)
  const streamingOutput = getStreamingOutput(task)
  const finalText = getFinalText(task)
  const toolCalls = getToolCalls(task)
  const scopeDisplay = getScopeDisplay(task)
  const timestamp = getTimestamp(task)

  const [isDetailExpanded, setIsDetailExpanded] = useState(status === 'running')

  // Auto expand detail when running, auto collapse when completed
  useEffect(() => {
    if (status === 'running') {
      setIsDetailExpanded(true)
    } else if (status === 'completed') {
      setIsDetailExpanded(false)
    }
  }, [status])

  const statusConfig = {
    completed: { icon: '✅', color: 'text-green-600' },
    running: { icon: '🔄', color: 'text-blue-600' },
    failed: { icon: '❌', color: 'text-red-600' },
    aborted: { icon: '⛔', color: 'text-gray-500' },
  }

  const config = statusConfig[status]
  const hasDetail = streamingOutput || finalText

  return (
    <div className="mx-3 mb-3 border-b border-gray-200 pb-3 last:border-b-0">
      {/* Header - Always Visible */}
      <div className="mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">{agentConfig.icon}</span>
          <span className="text-sm font-medium text-gray-900">{agentConfig.name}</span>
          <span className={`text-xs ${config.color}`}>{config.icon}</span>
          <span className="text-xs text-gray-500">· {scopeDisplay}</span>
          <span className="text-xs text-gray-400">· {timestamp}</span>
        </div>
      </div>

      {/* Detail Section - Collapsible */}
      {hasDetail && (
        <div className="mb-2">
          {/* Detail Header with inline toggle */}
          <button
            onClick={() => setIsDetailExpanded(!isDetailExpanded)}
            className="w-full flex items-center justify-between text-xs font-medium text-gray-700 mb-1.5 hover:text-blue-600 transition-colors"
          >
            <span>📝 详情：</span>
            <span className="text-blue-600">{isDetailExpanded ? '收起 ▲' : '展开 ▼'}</span>
          </button>

          {/* Detail Content - Card Style */}
          {isDetailExpanded && (
            <div>
              {/* Streaming Output */}
              {streamingOutput && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700 whitespace-pre-wrap">
                  {streamingOutput}
                  {status === 'running' && <span className="animate-pulse">█</span>}
                </div>
              )}

              {/* Result */}
              {finalText && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
                  {finalText}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tool Calls - Always Visible with Simple Indent */}
      {toolCalls.length > 0 && (
        <div>
          <div className="text-xs font-medium text-gray-700 mb-1.5">执行步骤：</div>
          <div className="space-y-1 pl-4">
            {toolCalls.map(tool => (
              <div key={tool.id} className="flex items-start gap-2 text-xs">
                <span>
                  {tool.status === 'completed' && '✅'}
                  {tool.status === 'running' && '🔄'}
                  {tool.status === 'failed' && '❌'}
                </span>
                <span className={tool.status === 'running' ? 'text-blue-600' : 'text-gray-600'}>
                  {tool.displayName}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
