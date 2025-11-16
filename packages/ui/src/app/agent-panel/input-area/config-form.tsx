import { XCircle, Check } from 'lucide-react'
import type { AgentDef } from '@/types/editor'
import { ParamField } from './param-field'

type ConfigFormProps = {
  agent: AgentDef
  paramValues: Record<string, string | number | boolean | string[]>
  additionalRequirements: string
  isRunning?: boolean
  onParamChange: (name: string, value: string | number | boolean | string[]) => void
  onAdditionalRequirementsChange: (value: string) => void
  onCancel: () => void
  onConfirm: () => void
}

export function ConfigForm({
  agent,
  paramValues,
  additionalRequirements,
  isRunning,
  onParamChange,
  onAdditionalRequirementsChange,
  onCancel,
  onConfirm,
}: ConfigFormProps) {
  return (
    <div className="border-t border-gray-200 p-3 bg-blue-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-blue-200">
        <div className="flex items-center gap-2">
          <span className="text-base">{agent.icon}</span>
          <span className="text-sm font-medium text-gray-900">{agent.name}</span>
        </div>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors" title="取消">
          <XCircle className="h-4 w-4" />
        </button>
      </div>

      {/* Parameters */}
      {agent.params && agent.params.length > 0 && (
        <div className="mb-3">
          {agent.params.map(param => (
            <ParamField key={param.name} param={param} value={paramValues[param.name]} onChange={onParamChange} />
          ))}
        </div>
      )}

      {/* Additional Requirements */}
      <div className="mb-3">
        <input
          type="text"
          value={additionalRequirements}
          onChange={e => onAdditionalRequirementsChange(e.target.value)}
          placeholder={agent.placeholder || '补充要求（可选）...'}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Confirm Button */}
      <div className="flex justify-end">
        <button
          onClick={onConfirm}
          className="flex items-center gap-1.5 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Check className="h-4 w-4" />
          <span>确认执行</span>
        </button>
      </div>
    </div>
  )
}
