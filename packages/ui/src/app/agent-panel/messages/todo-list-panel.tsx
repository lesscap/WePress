import { useState } from 'react'
import type { TodoList } from '@wepress/agent-query'
import { ChevronDown, ChevronUp } from 'lucide-react'

type TodoListPanelProps = {
  todoList: TodoList
}

export function TodoListPanel({ todoList }: TodoListPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  if (!todoList.items || todoList.items.length === 0) {
    return null
  }

  const completedCount = todoList.items.filter(item => item.status === 'completed').length
  const totalCount = todoList.items.length

  if (isCollapsed) {
    return (
      <div className="mx-3 mb-2 border-t border-gray-200 pt-2">
        <button
          onClick={() => setIsCollapsed(false)}
          className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded transition-colors"
        >
          <span className="text-xs text-gray-600">
            📋 任务进度: {completedCount} / {totalCount}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        </button>
      </div>
    )
  }

  return (
    <div className="mx-3 mb-2 border-t border-gray-200 pt-2">
      <div className="mb-2 flex items-center justify-between px-3">
        <span className="text-xs font-medium text-gray-700">
          📋 任务进度 ({completedCount}/{totalCount})
        </span>
        <button
          onClick={() => setIsCollapsed(true)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          title="收起"
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="space-y-1">
        {todoList.items.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2 px-3 py-1.5 text-xs ${
              item.status === 'completed' ? 'text-gray-500' : 'text-gray-700'
            }`}
          >
            <span className="flex-shrink-0 mt-0.5">
              {item.status === 'completed' ? '✓' : '○'}
            </span>
            <div className="flex-1">
              <div className={item.status === 'completed' ? 'line-through' : ''}>{item.content}</div>
              {item.activeForm && item.status !== 'completed' && (
                <div className="text-blue-600 mt-0.5">{item.activeForm}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
