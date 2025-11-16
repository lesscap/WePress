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
        console.log('[AgentPanel] Message received:', message.type, message)

        updateCurrentTask(prev => {
          if (!prev) return null
          const updated = { ...prev }

          // Handle text messages with conversationId merging
          if (message.type === 'text') {
            const existingIndex = prev.messages.findIndex(
              msg => msg.type === 'text' && msg.conversationId === message.conversationId,
            )

            if (existingIndex >= 0) {
              // Update existing text message (accumulate delta)
              updated.messages = prev.messages.map((msg, idx) => {
                if (idx !== existingIndex || msg.type !== 'text') return msg

                const newText = message.delta
                  ? msg.content.text + message.content.text
                  : message.content.text

                return {
                  ...msg,
                  content: {
                    ...msg.content,
                    text: newText,
                    status: message.content.status,
                  },
                }
              })
            } else {
              // New text message
              updated.messages = [...prev.messages, message]
            }
          } else if (message.type === 'usage') {
            // Accumulate usage tokens
            updated.messages = [...prev.messages, message]
            const currentUsage = updated.usage || { inputTokens: 0, outputTokens: 0, totalTokens: 0 }
            updated.usage = {
              inputTokens: currentUsage.inputTokens + (message.content.promptTokens || 0),
              outputTokens: currentUsage.outputTokens + (message.content.completionTokens || 0),
              totalTokens: currentUsage.totalTokens + (message.content.totalTokens || 0),
            }
          } else {
            // For other message types (tool_call, tool_result, etc.), just append
            updated.messages = [...prev.messages, message]
          }

          // Update todoList
          if (message.type === 'todolist') {
            updated.todoList = message.content.todoList
          }

          return updated
        })
      }

      // Stream ended, mark task as complete
      await query.getResult()
      updateCurrentTask(prev => {
        if (!prev) return null
        return {
          ...prev,
          endTime: Date.now(),
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
        usage={allTasks.reduce(
          (acc, t) => ({
            inputTokens: acc.inputTokens + (t.usage?.inputTokens || 0),
            outputTokens: acc.outputTokens + (t.usage?.outputTokens || 0),
            totalTokens: acc.totalTokens + (t.usage?.totalTokens || 0),
          }),
          { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
        )}
        isActive={hasRunningTask}
      />
    </div>
  )
}
