import { useState, useRef, useEffect } from 'react'
import { XCircle } from 'lucide-react'
import type { AgentDef, EditorSelection } from '@/types/editor'
import {
  mockArticleLevelAgents,
  mockSectionLevelAgents,
  mockTextLevelAgents
} from '@/mocks/editor-data'
import { AgentMenu } from './agent-menu'
import { ConfigForm } from './config-form'

type InputAreaProps = {
  selection: EditorSelection
  onExecuteAgent: (agentId: string) => void
  onAbort?: () => void
  isRunning?: boolean
}

export function InputArea({ selection, onExecuteAgent, onAbort, isRunning }: InputAreaProps) {
  const [selectedAgent, setSelectedAgent] = useState<AgentDef | null>(null)
  const [paramValues, setParamValues] = useState<Record<string, string | number | boolean | string[]>>({})
  const [additionalRequirements, setAdditionalRequirements] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const agentsByScope = {
    none: mockArticleLevelAgents,
    section: mockSectionLevelAgents,
    text: mockTextLevelAgents
  }

  const scopeDisplayMap = {
    none: '全文',
    section: selection.type === 'section' ? `第 ${selection.sectionIndex + 1} 段` : '',
    text: '选中文本'
  }

  const agents = agentsByScope[selection.type]
  const scopeDisplayText = scopeDisplayMap[selection.type]

  // Initialize param values with defaults when agent is selected
  useEffect(() => {
    if (selectedAgent?.params) {
      const defaults: Record<string, string | number | boolean | string[]> = {}
      selectedAgent.params.forEach(param => {
        if (param.defaultValue !== undefined) {
          defaults[param.name] = param.defaultValue
        }
      })
      setParamValues(defaults)
    }
  }, [selectedAgent])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAgentClick = (agent: AgentDef) => {
    setSelectedAgent(agent)
    setIsMenuOpen(false)
  }

  const handleCancel = () => {
    setSelectedAgent(null)
    setParamValues({})
    setAdditionalRequirements('')
  }

  const handleConfirm = () => {
    if (!selectedAgent) return

    // TODO: Pass params and requirements to the agent execution
    console.log('Execute agent:', selectedAgent.id, {
      params: paramValues,
      additionalRequirements,
      selection
    })

    onExecuteAgent(selectedAgent.id)

    // Reset state
    handleCancel()
  }

  const handleParamChange = (name: string, value: string | number | boolean | string[]) => {
    setParamValues({ ...paramValues, [name]: value })
  }

  // If agent selected, show configuration UI
  if (selectedAgent) {
    return (
      <ConfigForm
        agent={selectedAgent}
        paramValues={paramValues}
        additionalRequirements={additionalRequirements}
        isRunning={isRunning}
        onParamChange={handleParamChange}
        onAdditionalRequirementsChange={setAdditionalRequirements}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    )
  }

  // Default: show input field with agent menu
  return (
    <div className="relative border-t border-gray-200 p-3">
      {/* Agent Menu (Popover) */}
      {isMenuOpen && (
        <div ref={menuRef}>
          <AgentMenu
            agents={agents}
            scopeDisplayText={scopeDisplayText}
            onSelect={handleAgentClick}
          />
        </div>
      )}

      {/* Input Field */}
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          onFocus={() => setIsMenuOpen(true)}
          placeholder="输入指令或选择操作..."
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {isRunning && onAbort && (
          <button
            onClick={onAbort}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
            title="中止当前任务"
          >
            <XCircle className="h-4 w-4" />
            <span>中止</span>
          </button>
        )}
      </div>
    </div>
  )
}
