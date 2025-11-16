// Type definitions for editor UI

export type Section = {
  id: string
  title: string
  level: 1 | 2 | 3 | 4 | 5 | 6
  body: string
}

export type EditorSelection =
  | { type: 'none' }
  | { type: 'section'; sectionIndex: number; sectionId: string; sectionTitle: string }
  | {
      type: 'text'
      sectionIndex: number
      sectionId: string
      range: { start: number; end: number }
      selectedText: string
    }

// Agent parameter types
type AgentParamBase = {
  name: string
  label: string
  required?: boolean
}

type SelectParam = AgentParamBase & {
  type: 'select'
  options: { value: string; label: string }[]
  defaultValue?: string
}

type RadioParam = AgentParamBase & {
  type: 'radio'
  options: { value: string; label: string }[]
  defaultValue?: string
}

type BooleanParam = AgentParamBase & {
  type: 'boolean'
  defaultValue?: boolean
  description?: string
}

type TagsParam = AgentParamBase & {
  type: 'tags'
  options: { value: string; label: string }[]
  defaultValue?: string[]
}

type NumberParam = AgentParamBase & {
  type: 'number'
  min?: number
  max?: number
  step?: number
  defaultValue?: number
  unit?: string
}

type TextParam = AgentParamBase & {
  type: 'text'
  defaultValue?: string
  placeholder?: string
}

type SliderParam = AgentParamBase & {
  type: 'slider'
  min: number
  max: number
  step?: number
  defaultValue?: number
  unit?: string
  description?: string
}

export type AgentParam = SelectParam | RadioParam | BooleanParam | TagsParam | NumberParam | TextParam | SliderParam

export type AgentDef = {
  id: string
  name: string
  icon: string
  description: string
  params?: AgentParam[]
  placeholder?: string // Placeholder for additional requirements input
}
