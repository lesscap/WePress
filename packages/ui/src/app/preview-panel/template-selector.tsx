import { ChevronDown, ChevronUp } from 'lucide-react'

type TemplateSelectorProps = {
  isOpen: boolean
  onToggle: () => void
}

const templates = [
  { id: '1', name: '简约风' },
  { id: '2', name: '科技风' },
  { id: '3', name: '文艺风' },
  { id: '4', name: '商务风' },
  { id: '5', name: '清新风' }
]

export function TemplateSelector({ isOpen, onToggle }: TemplateSelectorProps) {
  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-medium text-gray-500">选择模板</div>
        <button
          type="button"
          onClick={onToggle}
          className="text-gray-500 hover:text-gray-700"
        >
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>
      {isOpen && (
        <>
          <div className="grid grid-cols-5 gap-2 mb-3">
            {templates.map(template => (
              <button
                key={template.id}
                type="button"
                className="w-full rounded-lg border border-gray-300 bg-white hover:bg-gray-50 overflow-hidden"
              >
                <div className="h-20 bg-gray-100 flex items-center justify-center">
                  <span className="text-xs text-gray-400">缩略图</span>
                </div>
                <div className="py-1.5 text-xs text-center">{template.name}</div>
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50"
                disabled
              >
                上一页
              </button>
              <span className="text-xs text-gray-500">1/1</span>
              <button
                type="button"
                className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50"
                disabled
              >
                下一页
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
