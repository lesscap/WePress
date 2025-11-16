import type { Task } from '@/types/editor'

type TaskExecutingProps = {
  task: Task
  onAbort: () => void
}

export function TaskExecuting({ task, onAbort }: TaskExecutingProps) {
  return (
    <div className="px-3 pb-3">
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-base">{task.agentIcon}</span>
            <span className="text-sm font-medium text-gray-900">{task.agentName}</span>
          </div>
          <button
            onClick={onAbort}
            className="text-xs text-gray-500 hover:text-red-600 transition-colors"
          >
            中止
          </button>
        </div>

        <div className="text-xs text-gray-600 mb-3">
          📍 {task.scopeDisplay}
        </div>

        <div className="space-y-1.5">
          <div className="text-xs font-medium text-gray-700">执行步骤：</div>
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
    </div>
  )
}
