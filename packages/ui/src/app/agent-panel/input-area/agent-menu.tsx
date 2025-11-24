import { useMemo } from 'react'
import type { AgentDef } from '@/types/editor'

type AgentMenuProps = {
  agents: AgentDef[]
  scopeDisplayText: string
  onSelect: (agent: AgentDef) => void
}

export function AgentMenu({ agents, scopeDisplayText, onSelect }: AgentMenuProps) {
  const filteredAgents = useMemo(() => agents.filter(a => a.id !== 'custom'), [agents])

  return (
    <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto z-10">
      <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">
        针对「{scopeDisplayText}」可用的命令：
      </div>
      <div className="py-1">
        {filteredAgents.map(agent => (
          <button
            key={agent.id}
            onClick={() => onSelect(agent)}
            className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-start gap-2"
          >
            <span className="text-base">{agent.icon}</span>
            <div className="flex-1">
              <div className="text-sm text-gray-900">{agent.name}</div>
              <div className="text-xs text-gray-500">{agent.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
