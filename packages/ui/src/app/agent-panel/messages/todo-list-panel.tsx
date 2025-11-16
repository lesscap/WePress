import type { TodoList } from '@wepress/agent-query'

type TodoListPanelProps = {
  todoList: TodoList
}

export function TodoListPanel({ todoList }: TodoListPanelProps) {
  if (!todoList.items || todoList.items.length === 0) {
    return null
  }

  return (
    <div className="mb-2">
      <div className="text-xs font-medium text-gray-700 mb-1.5">执行步骤：</div>
      <div className="space-y-1 pl-4">
        {todoList.items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs">
            <span className="flex-shrink-0">
              {item.status === 'completed' && '✅'}
              {item.status === 'in_progress' && '🔄'}
              {item.status === 'pending' && '○'}
            </span>
            <div className="flex-1">
              <span
                className={
                  item.status === 'in_progress'
                    ? 'text-blue-600'
                    : item.status === 'completed'
                      ? 'text-gray-600'
                      : 'text-gray-700'
                }
              >
                {item.status === 'in_progress' ? item.activeForm : item.content}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
