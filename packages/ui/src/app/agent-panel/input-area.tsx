import { useState, useRef, useEffect } from 'react'
import { XCircle, Check } from 'lucide-react'
import type { AgentDef, EditorSelection, AgentParam } from '@/types/editor'
import {
  mockArticleLevelAgents,
  mockSectionLevelAgents,
  mockTextLevelAgents
} from '@/mocks/editor-data'

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

  const renderParamField = (param: AgentParam) => {
    const value = paramValues[param.name] ?? param.defaultValue

    if (param.type === 'select') {
      return (
        <div key={param.name} className="mb-3">
          <label className="mb-1.5 block text-xs font-medium text-gray-700">
            {param.label}
            {param.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          <select
            value={value as string}
            onChange={e => setParamValues({ ...paramValues, [param.name]: e.target.value })}
            className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {param.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )
    }

    if (param.type === 'radio') {
      return (
        <div key={param.name} className="mb-3">
          <label className="mb-1.5 block text-xs font-medium text-gray-700">
            {param.label}
            {param.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          <div className="flex gap-4">
            {param.options.map(option => (
              <label key={option.value} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name={param.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={e => setParamValues({ ...paramValues, [param.name]: e.target.value })}
                  className="w-3.5 h-3.5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )
    }

    if (param.type === 'boolean') {
      return (
        <div key={param.name} className="mb-3">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="text-xs font-medium text-gray-700">{param.label}</div>
              {param.description && (
                <div className="text-xs text-gray-500 mt-0.5">{param.description}</div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setParamValues({ ...paramValues, [param.name]: !(value as boolean) })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                value ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  value ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </label>
        </div>
      )
    }

    if (param.type === 'tags') {
      const selectedTags = (value as string[]) || []
      return (
        <div key={param.name} className="mb-3">
          <label className="mb-1.5 block text-xs font-medium text-gray-700">
            {param.label}
            {param.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          <div className="flex flex-wrap gap-2">
            {param.options.map(option => {
              const isSelected = selectedTags.includes(option.value)
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    const newTags = isSelected
                      ? selectedTags.filter(t => t !== option.value)
                      : [...selectedTags, option.value]
                    setParamValues({ ...paramValues, [param.name]: newTags })
                  }}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    isSelected
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>
      )
    }

    if (param.type === 'number') {
      return (
        <div key={param.name} className="mb-3">
          <label className="mb-1.5 block text-xs font-medium text-gray-700">
            {param.label}
            {param.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={value as number}
              onChange={e => setParamValues({ ...paramValues, [param.name]: Number(e.target.value) })}
              min={param.min}
              max={param.max}
              step={param.step}
              className="flex-1 px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {param.unit && <span className="text-sm text-gray-500">{param.unit}</span>}
          </div>
        </div>
      )
    }

    if (param.type === 'text') {
      return (
        <div key={param.name} className="mb-3">
          <label className="mb-1.5 block text-xs font-medium text-gray-700">
            {param.label}
            {param.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          <input
            type="text"
            value={value as string}
            onChange={e => setParamValues({ ...paramValues, [param.name]: e.target.value })}
            placeholder={param.placeholder}
            className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )
    }

    if (param.type === 'slider') {
      return (
        <div key={param.name} className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-gray-700">{param.label}</label>
            <span className="text-xs text-gray-600">
              {value}
              {param.unit}
            </span>
          </div>
          {param.description && (
            <div className="text-xs text-gray-500 mb-2">{param.description}</div>
          )}
          <input
            type="range"
            value={value as number}
            onChange={e => setParamValues({ ...paramValues, [param.name]: Number(e.target.value) })}
            min={param.min}
            max={param.max}
            step={param.step || 1}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{param.min}{param.unit}</span>
            <span>{param.max}{param.unit}</span>
          </div>
        </div>
      )
    }

    return null
  }

  // If agent selected, show configuration UI
  if (selectedAgent) {
    return (
      <div className="border-t border-gray-200 p-3 bg-blue-50">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-blue-200">
          <div className="flex items-center gap-2">
            <span className="text-base">{selectedAgent.icon}</span>
            <span className="text-sm font-medium text-gray-900">{selectedAgent.name}</span>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="取消"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>

        {/* Parameters */}
        {selectedAgent.params && selectedAgent.params.length > 0 && (
          <div className="mb-3">
            {selectedAgent.params.map(param => renderParamField(param))}
          </div>
        )}

        {/* Additional Requirements */}
        <div className="mb-3">
          <input
            type="text"
            value={additionalRequirements}
            onChange={e => setAdditionalRequirements(e.target.value)}
            placeholder={selectedAgent.placeholder || '补充要求（可选）...'}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Confirm Button */}
        <div className="flex justify-end">
          <button
            onClick={handleConfirm}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Check className="h-4 w-4" />
            <span>确认执行</span>
          </button>
        </div>
      </div>
    )
  }

  // Default: show input field with agent menu
  return (
    <div className="relative border-t border-gray-200 p-3">
      {/* Agent Menu (Popover) */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto z-10"
        >
          <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">
            💬 针对「{scopeDisplayText}」可以：
          </div>
          <div className="py-1">
            {agents.map(agent => (
              <button
                key={agent.id}
                onClick={() => handleAgentClick(agent)}
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
          <div className="px-3 py-2 text-xs text-gray-500 border-t border-gray-100">
            💭 或输入自定义指令
          </div>
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
