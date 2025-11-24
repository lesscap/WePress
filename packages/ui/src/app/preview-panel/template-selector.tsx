import { useState, useEffect, useCallback } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { Template, TemplateListItem } from '@/types/template'

const STORAGE_KEY = 'wepress:selected-template-id'

type TemplateSelectorProps = {
  isOpen: boolean
  onToggle: () => void
  selectedTemplate: Template | null
  onSelectTemplate: (template: Template | null) => void
}

export function TemplateSelector({ isOpen, onToggle, selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<TemplateListItem[]>([])
  const [loading, setLoading] = useState(true)

  const selectById = useCallback(async (id: string) => {
    const res = await fetch(`/api/templates/${encodeURIComponent(id)}`)
    const template: Template = await res.json()
    onSelectTemplate(template)
    localStorage.setItem(STORAGE_KEY, id)
  }, [onSelectTemplate])

  // Load template list
  useEffect(() => {
    fetch('/api/templates')
      .then(res => res.json())
      .then((data: TemplateListItem[]) => {
        setTemplates(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Restore saved template selection
  useEffect(() => {
    const savedId = localStorage.getItem(STORAGE_KEY)
    if (savedId) {
      selectById(savedId).catch(() => localStorage.removeItem(STORAGE_KEY))
    }
  }, [selectById])

  const handleSelect = (item: TemplateListItem) => {
    if (selectedTemplate?.id === item.id) {
      onSelectTemplate(null)
      localStorage.removeItem(STORAGE_KEY)
      return
    }
    selectById(item.id)
  }

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-medium text-gray-500">选择模板</div>
        <button type="button" onClick={onToggle} className="text-gray-500 hover:text-gray-700">
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>
      {isOpen && (
        <div className="grid grid-cols-5 gap-2">
          {loading ? (
            <div className="col-span-5 text-center text-xs text-gray-400 py-4">加载中...</div>
          ) : (
            templates.map(template => (
              <button
                key={template.id}
                type="button"
                onClick={() => handleSelect(template)}
                className={`w-full rounded-lg border overflow-hidden transition-all ${
                  selectedTemplate?.id === template.id
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="h-16 bg-gray-100 flex items-center justify-center">
                  <span className="text-xs text-gray-400">
                    {template.thumbnail ? <img src={template.thumbnail} alt="" className="h-full w-full object-cover" /> : '预览'}
                  </span>
                </div>
                <div className="py-1.5 text-xs text-center truncate px-1">{template.name}</div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
