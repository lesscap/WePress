import { useState } from 'react'
import { X } from 'lucide-react'
import type { Task } from '@/types/editor'

type TaskQueueProps = {
  tasks: Task[]
  onRemove?: (taskId: string) => void
}

export function TaskQueue({ tasks, onRemove }: TaskQueueProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const queuedTasks = tasks.filter(t => t.status === 'queued')

  if (queuedTasks.length === 0) {
    return null
  }

  return (
    <div className="border-t border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 text-left text-xs font-medium text-gray-600 hover:bg-gray-50 flex items-center justify-between"
      >
        <span>⏳ 等待中 ({queuedTasks.length})</span>
        <span className="text-gray-400">{isExpanded ? '收起 ▲' : '展开 ▼'}</span>
      </button>

      {isExpanded && (
        <div className="max-h-40 overflow-y-auto border-t border-gray-100">
          {queuedTasks.map(task => (
            <div
              key={task.id}
              className="px-3 py-1.5 hover:bg-gray-50 flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0 text-xs">
                <span>{task.agentIcon}</span>
                <span className="text-gray-900">{task.agentName}</span>
                <span className="text-gray-500">· {task.scopeDisplay}</span>
              </div>
              {onRemove && (
                <button
                  onClick={() => onRemove(task.id)}
                  className="text-gray-400 hover:text-red-600 flex-shrink-0 p-1 hover:bg-red-50 rounded transition-colors"
                  title="移除任务"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
