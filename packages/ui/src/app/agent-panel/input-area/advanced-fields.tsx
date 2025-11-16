import type { AgentParam } from '@/types/editor'

type ParamFieldProps = {
  param: AgentParam
  value: string | number | boolean | string[] | undefined
  onChange: (name: string, value: string | number | boolean | string[]) => void
}

export function TagsField({ param, value, onChange }: ParamFieldProps & { param: Extract<AgentParam, { type: 'tags' }> }) {
  const selectedTags = (value ?? param.defaultValue ?? []) as string[]
  return (
    <div className="mb-3">
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
                onChange(param.name, newTags)
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

export function NumberField({ param, value, onChange }: ParamFieldProps & { param: Extract<AgentParam, { type: 'number' }> }) {
  const currentValue = value ?? param.defaultValue
  return (
    <div className="mb-3">
      <label className="mb-1.5 block text-xs font-medium text-gray-700">
        {param.label}
        {param.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={currentValue as number}
          onChange={e => onChange(param.name, Number(e.target.value))}
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

export function SliderField({ param, value, onChange }: ParamFieldProps & { param: Extract<AgentParam, { type: 'slider' }> }) {
  const currentValue = value ?? param.defaultValue
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-medium text-gray-700">{param.label}</label>
        <span className="text-xs text-gray-600">
          {currentValue}
          {param.unit}
        </span>
      </div>
      {param.description && (
        <div className="text-xs text-gray-500 mb-2">{param.description}</div>
      )}
      <input
        type="range"
        value={currentValue as number}
        onChange={e => onChange(param.name, Number(e.target.value))}
        min={param.min}
        max={param.max}
        step={param.step || 1}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>
          {param.min}
          {param.unit}
        </span>
        <span>
          {param.max}
          {param.unit}
        </span>
      </div>
    </div>
  )
}
