import type { AgentParam } from '@/types/editor'

type ParamFieldProps = {
  param: AgentParam
  value: string | number | boolean | string[] | undefined
  onChange: (name: string, value: string | number | boolean | string[]) => void
}

export function SelectField({ param, value, onChange }: ParamFieldProps & { param: Extract<AgentParam, { type: 'select' }> }) {
  return (
    <div className="mb-3">
      <label className="mb-1.5 block text-xs font-medium text-gray-700">
        {param.label}
        {param.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select
        value={(value ?? param.defaultValue) as string}
        onChange={e => onChange(param.name, e.target.value)}
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

export function RadioField({ param, value, onChange }: ParamFieldProps & { param: Extract<AgentParam, { type: 'radio' }> }) {
  const currentValue = value ?? param.defaultValue
  return (
    <div className="mb-3">
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
              checked={currentValue === option.value}
              onChange={e => onChange(param.name, e.target.value)}
              className="w-3.5 h-3.5 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export function BooleanField({ param, value, onChange }: ParamFieldProps & { param: Extract<AgentParam, { type: 'boolean' }> }) {
  const currentValue = value ?? param.defaultValue
  return (
    <div className="mb-3">
      <label className="flex items-center justify-between cursor-pointer">
        <div>
          <div className="text-xs font-medium text-gray-700">{param.label}</div>
          {param.description && (
            <div className="text-xs text-gray-500 mt-0.5">{param.description}</div>
          )}
        </div>
        <button
          type="button"
          onClick={() => onChange(param.name, !(currentValue as boolean))}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            currentValue ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              currentValue ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </label>
    </div>
  )
}

export function TextField({ param, value, onChange }: ParamFieldProps & { param: Extract<AgentParam, { type: 'text' }> }) {
  const currentValue = value ?? param.defaultValue ?? ''
  return (
    <div className="mb-3">
      <label className="mb-1.5 block text-xs font-medium text-gray-700">
        {param.label}
        {param.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type="text"
        value={currentValue as string}
        onChange={e => onChange(param.name, e.target.value)}
        placeholder={param.placeholder}
        className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  )
}
