import type { AgentParam } from '@/types/editor'
import { SelectField, RadioField, BooleanField, TextField } from './basic-fields'
import { TagsField, NumberField, SliderField } from './advanced-fields'

type ParamFieldProps = {
  param: AgentParam
  value: string | number | boolean | string[] | undefined
  onChange: (name: string, value: string | number | boolean | string[]) => void
}

export function ParamField({ param, value, onChange }: ParamFieldProps) {
  const fieldComponents = {
    select: SelectField,
    radio: RadioField,
    boolean: BooleanField,
    tags: TagsField,
    number: NumberField,
    text: TextField,
    slider: SliderField,
  }

  const Component = fieldComponents[param.type] as React.ComponentType<ParamFieldProps>
  return <Component param={param} value={value} onChange={onChange} />
}
