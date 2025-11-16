import { TaskHistory } from './task-history'
import { TaskQueue } from './task-queue'
import { StatusBar } from './status-bar'
import { InputArea } from './input-area'
import type { EditorSelection } from '@/types/editor'
import {
  mockRunningTask,
  mockQueuedTasks,
  mockCompletedTasks
} from '@/mocks/editor-data'

type AgentPanelProps = {
  selection: EditorSelection
}

export function AgentPanel({ selection }: AgentPanelProps) {
  // Combine all tasks in chronological order (oldest first, newest last)
  const allTasks = [...mockCompletedTasks, mockRunningTask]

  // Check if there's a running task
  const hasRunningTask = allTasks.some(t => t.status === 'running')

  // Mock token count (in real app, this would come from state)
  const totalTokens = 1234

  const handleExecuteAgent = (agentId: string) => {
    console.log('Execute agent:', agentId, 'with selection:', selection)
  }

  const handleAbortTask = () => {
    console.log('Abort current running task')
  }

  const handleRemoveTask = (taskId: string) => {
    console.log('Remove task:', taskId)
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Task History (Scrollable) - includes all tasks (completed + running) */}
      <TaskHistory tasks={allTasks} />

      {/* Task Queue (Fixed, Collapsible) */}
      <TaskQueue tasks={mockQueuedTasks} onRemove={handleRemoveTask} />

      {/* Input Area (Fixed) */}
      <InputArea
        selection={selection}
        onExecuteAgent={handleExecuteAgent}
        onAbort={handleAbortTask}
        isRunning={hasRunningTask}
      />

      {/* Status Bar (Fixed, Bottom) */}
      <StatusBar
        selection={selection}
        totalTokens={totalTokens}
        isActive={hasRunningTask}
      />
    </div>
  )
}
