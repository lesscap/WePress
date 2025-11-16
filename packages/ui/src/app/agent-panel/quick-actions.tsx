import type { AgentDef, EditorSelection } from '@/types/editor'
import {
  mockArticleLevelAgents,
  mockSectionLevelAgents,
  mockTextLevelAgents
} from '@/mocks/editor-data'

type QuickActionsProps = {
  selection: EditorSelection
  onExecuteAgent: (agentId: string) => void
}

export function QuickActions({ selection, onExecuteAgent }: QuickActionsProps) {
  const getAvailableAgents = (): AgentDef[] => {
    switch (selection.type) {
      case 'none':
        return mockArticleLevelAgents
      case 'section':
        return mockSectionLevelAgents
      case 'text':
        return mockTextLevelAgents
    }
  }

  const agents = getAvailableAgents()

  return (
    <div className="border-b border-gray-200 p-3">
      <div className="text-xs font-medium text-gray-700 mb-2">🚀 快速操作</div>
      <div className="grid grid-cols-2 gap-2">
        {agents.map(agent => (
          <button
            key={agent.id}
            onClick={() => onExecuteAgent(agent.id)}
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 hover:border-gray-400 transition-colors"
            title={agent.description}
          >
            <span>{agent.icon}</span>
            <span className="text-gray-900">{agent.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
