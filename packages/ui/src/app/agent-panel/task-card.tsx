import { useState, useEffect } from 'react'
import type { Task } from '@/types/editor'

type TaskCardProps = {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const [isDetailExpanded, setIsDetailExpanded] = useState(task.status === 'running')

  // Auto expand detail when running, auto collapse when completed
  useEffect(() => {
    if (task.status === 'running') {
      setIsDetailExpanded(true)
    } else if (task.status === 'completed') {
      setIsDetailExpanded(false)
    }
  }, [task.status])

  const statusConfig = {
    completed: { icon: '✅', color: 'text-green-600' },
    running: { icon: '🔄', color: 'text-blue-600' },
    failed: { icon: '❌', color: 'text-red-600' },
    aborted: { icon: '⛔', color: 'text-gray-500' },
    queued: { icon: '⏳', color: 'text-gray-500' },
    waiting_input: { icon: '⏸️', color: 'text-yellow-600' }
  }

  const config = statusConfig[task.status]
  const hasDetail = task.streamingOutput || task.result

  return (
    <div className="mx-3 mb-3 border-b border-gray-200 pb-3 last:border-b-0">
      {/* Header - Always Visible */}
      <div className="mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">{task.agentIcon}</span>
          <span className="text-sm font-medium text-gray-900">{task.agentName}</span>
          <span className={`text-xs ${config.color}`}>{config.icon}</span>
          <span className="text-xs text-gray-500">· {task.scopeDisplay}</span>
          {task.timestamp && (
            <span className="text-xs text-gray-400">· {task.timestamp}</span>
          )}
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
              {task.streamingOutput && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700 whitespace-pre-wrap">
                  {task.streamingOutput}
                  {task.status === 'running' && <span className="animate-pulse">█</span>}
                </div>
              )}

              {/* Result */}
              {task.result && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
                  {task.result}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tool Calls - Always Visible with Simple Indent */}
      {task.toolCalls.length > 0 && (
        <div>
          <div className="text-xs font-medium text-gray-700 mb-1.5">执行步骤：</div>
          <div className="space-y-1 pl-4">
            {task.toolCalls.map(tool => (
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
