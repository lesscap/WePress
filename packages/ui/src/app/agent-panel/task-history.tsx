import { useEffect, useRef } from 'react'
import { TaskCard } from './task-card'
import type { Task } from '@/types/task'

type TaskHistoryProps = {
  tasks: Task[]
}

export function TaskHistory({ tasks }: TaskHistoryProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom when tasks update and there's a running task
  useEffect(() => {
    const hasRunning = tasks.some(t => !t.endTime)
    if (hasRunning) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [tasks])

  if (tasks.length === 0) {
    return <div className="flex-1 flex items-center justify-center text-sm text-gray-400">暂无任务历史</div>
  }

  return (
    <div className="flex-1 overflow-y-auto py-3">
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}
