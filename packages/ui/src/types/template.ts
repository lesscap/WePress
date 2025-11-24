// Template type definitions

export type TemplateListItem = {
  id: string
  name: string
  description: string | null
  thumbnail: string | null
  createdAt: string
  updatedAt: string
}

export type Template = TemplateListItem & {
  content: string
}
