import { TaskCard } from './task-card'
import type { Task } from '@/types/task'

type TaskHistoryProps = {
  tasks: Task[]
}

export function TaskHistory({ tasks }: TaskHistoryProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
        暂无任务历史
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto py-3">
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  )
}
