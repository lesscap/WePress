import type { Task } from '@/types/editor'

type TaskItemProps = {
  task: Task
  onRetry?: () => void
  onView?: () => void
  onRemove?: () => void
}

export function TaskItem({ task, onRetry, onView, onRemove }: TaskItemProps) {
  const getStatusDisplay = () => {
    switch (task.status) {
      case 'queued':
        return { icon: '⏳', text: '队列中', color: 'text-gray-600' }
      case 'waiting_input':
        return { icon: '⏸️', text: '等待输入', color: 'text-yellow-600' }
      case 'completed':
        return { icon: '✅', text: '已完成', color: 'text-green-600' }
      case 'failed':
        return { icon: '❌', text: '失败', color: 'text-red-600' }
      case 'aborted':
        return { icon: '⛔', text: '已中止', color: 'text-gray-500' }
      default:
        return { icon: '⏳', text: '未知', color: 'text-gray-600' }
    }
  }

  const status = getStatusDisplay()

  return (
    <div className="flex items-start justify-between gap-2 px-3 py-2 hover:bg-gray-50 rounded">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span>{task.agentIcon}</span>
          <span className="text-sm font-medium text-gray-900 truncate">
            {task.agentName}
          </span>
          <span className={`text-xs ${status.color}`}>
            {status.icon} {status.text}
          </span>
        </div>
        <div className="text-xs text-gray-500 truncate">
          {task.scopeDisplay}
        </div>
        {task.result && (
          <div className="text-xs text-gray-600 mt-1">
            {task.result}
          </div>
        )}
      </div>

      {task.status === 'completed' && (
        <div className="flex gap-1">
          {onView && (
            <button
              onClick={onView}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              查看
            </button>
          )}
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-xs text-gray-600 hover:text-gray-700"
            >
              重试
            </button>
          )}
        </div>
      )}

      {(task.status === 'queued' || task.status === 'aborted') && onRemove && (
        <button
          onClick={onRemove}
          className="text-xs text-gray-400 hover:text-red-600"
        >
          移除
        </button>
      )}
    </div>
  )
}
