import { useState, useEffect, useRef } from 'react'
import type { AgentQuery } from '@wepress/agent-query'
import { TaskHistory } from './task-history'
import { TaskQueue } from './task-queue'
import { StatusBar } from './status-bar'
import { InputArea } from './input-area'
import type { EditorSelection, Section } from '@/types/editor'
import type { Task, TaskRequest } from '@/types/task'
import { executeAgent } from '@/services/agent-executor'
import { createToolExecutor } from '@/services/agent-tools'
import { mockSections } from '@/mocks/editor-data'

type AgentPanelProps = {
  selection: EditorSelection
}

export function AgentPanel({ selection }: AgentPanelProps) {
  // State
  const [tasks, setTasks] = useState<Task[]>([])
  const [queue, setQueue] = useState<TaskRequest[]>([])
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [sections, setSections] = useState<Section[]>(mockSections)

  // Refs - avoid closure issues
  const currentTaskRef = useRef<Task | null>(null)
  const currentQueryRef = useRef<AgentQuery | null>(null)

  // Sync state and ref
  const updateCurrentTask = (task: Task | null | ((prev: Task | null) => Task | null)) => {
    if (typeof task === 'function') {
      setCurrentTask(prev => {
        const updated = task(prev)
        currentTaskRef.current = updated
        return updated
      })
    } else {
      currentTaskRef.current = task
      setCurrentTask(task)
    }
  }

  // Add to queue
  const handleAddTaskRequest = (request: TaskRequest) => {
    setQueue(prev => [...prev, request])
  }

  // Remove from queue
  const handleRemoveTaskRequest = (taskId: string) => {
    setQueue(prev => prev.filter(t => t.id !== taskId))
  }

  // Abort current task
  const handleAbort = async () => {
    if (currentQueryRef.current) {
      await currentQueryRef.current.interrupt()
    }
  }

  // Auto execute queue
  useEffect(() => {
    if (!currentTask && queue.length > 0) {
      startNextTask()
    }
  }, [currentTask, queue])

  const startNextTask = async () => {
    const request = queue[0]
    setQueue(prev => prev.slice(1)) // dequeue

    // Create initial Task
    const task: Task = {
      ...request,
      messages: [],
      startTime: Date.now(),
    }
    updateCurrentTask(task)

    try {
      // Create tool executor
      const toolExecutor = createToolExecutor({
        sections,
        setSections,
        selectedText: request.scope.type === 'text' ? request.scope.selectedText : undefined,
      })

      // Create query
      const query = executeAgent({
        request,
        onToolCall: toolExecutor,
      })

      currentQueryRef.current = query

      // Consume stream, update messages in real-time
      for await (const message of query.stream) {
        updateCurrentTask(prev => {
          if (!prev) return null
          const updated = { ...prev }
          updated.messages = [...prev.messages, message]

          // Update todoList
          if (message.type === 'todolist') {
            updated.todoList = message.content.todoList
          }

          return updated
        })
      }

      // Stream ended, get final result and update usage
      const result = await query.getResult()
      updateCurrentTask(prev => {
        if (!prev) return null
        return {
          ...prev,
          endTime: Date.now(),
          usage: result?.usage
            ? {
                inputTokens: result.usage.inputTokens || 0,
                outputTokens: result.usage.outputTokens || 0,
                totalTokens: result.usage.totalTokens || 0,
              }
            : undefined,
        }
      })
    } catch (error) {
      console.error('Task failed:', error)
      // Error is already in messages, no need to handle separately
    } finally {
      // Move completed task to history (use ref to get latest value)
      if (currentTaskRef.current) {
        setTasks(prev => [...prev, currentTaskRef.current!])
      }

      currentQueryRef.current = null
      updateCurrentTask(null) // Trigger next task
    }
  }

  // Merge for display
  const allTasks = currentTask ? [...tasks, currentTask] : tasks
  const hasRunningTask = currentTask !== null

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Task History (Scrollable) - includes all tasks (completed + running) */}
      <TaskHistory tasks={allTasks} />

      {/* Task Queue (Fixed, Collapsible) */}
      <TaskQueue tasks={queue} onRemove={handleRemoveTaskRequest} />

      {/* Input Area (Fixed) */}
      <InputArea
        selection={selection}
        onAddTaskRequest={handleAddTaskRequest}
        onAbort={handleAbort}
        isRunning={hasRunningTask}
      />

      {/* Status Bar (Fixed, Bottom) */}
      <StatusBar
        selection={selection}
        totalTokens={allTasks.reduce((sum, t) => sum + (t.usage?.totalTokens || 0), 0)}
        isActive={hasRunningTask}
      />
    </div>
  )
}
