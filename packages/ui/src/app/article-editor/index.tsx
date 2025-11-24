import { useState, type Dispatch, type SetStateAction } from 'react'
import { List, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EditorSelection, Section } from '@/types/editor'
import type { ParseResult } from '@/utils/markdown-parser'
import { OutlineView } from './outline-view'
import { DetailView } from './detail-view'

type ViewMode = 'outline' | 'detail'

type ArticleEditorProps = {
  selection: EditorSelection
  onSelectionChange: (selection: EditorSelection) => void
  sections: Section[]
  setSections: Dispatch<SetStateAction<Section[]>>
}

export function ArticleEditor({ selection, onSelectionChange, sections, setSections }: ArticleEditorProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('detail')

  const handlePageClick = () => {
    onSelectionChange({ type: 'none' })
  }

  const handleSectionUpdate = (index: number, result: ParseResult) => {
    setSections(prev => {
      const updated = [...prev]

      // If orphan content exists, merge to previous section
      if (result.orphanContent && index > 0) {
        const prevSection = updated[index - 1]
        updated[index - 1] = {
          ...prevSection,
          body: prevSection.body + '\n\n' + result.orphanContent,
        }
        updated.splice(index, 1)
      } else {
        updated.splice(index, 1, ...result.sections)
      }

      return updated
    })
    onSelectionChange({ type: 'none' })
  }

  const handleMoveSection = (fromIndex: number, toIndex: number) => {
    setSections(prev => {
      const updated = [...prev]
      const [moved] = updated.splice(fromIndex, 1)
      updated.splice(toIndex, 0, moved)
      return updated
    })
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {/* View mode toggle */}
      <div className="flex items-center justify-end gap-1 px-4 py-2 border-b border-gray-100">
        <button
          type="button"
          onClick={() => setViewMode('outline')}
          className={cn(
            'flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors',
            viewMode === 'outline' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100',
          )}
          title="大纲视图"
        >
          <List className="h-3.5 w-3.5" />
          <span>大纲</span>
        </button>
        <button
          type="button"
          onClick={() => setViewMode('detail')}
          className={cn(
            'flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors',
            viewMode === 'detail' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100',
          )}
          title="详情视图"
        >
          <FileText className="h-3.5 w-3.5" />
          <span>详情</span>
        </button>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto p-8 cursor-default" onClick={handlePageClick}>
        {viewMode === 'outline' ? (
          <OutlineView
            sections={sections}
            selection={selection}
            onSelectionChange={onSelectionChange}
            onMoveSection={handleMoveSection}
          />
        ) : (
          <DetailView
            sections={sections}
            selection={selection}
            onSelectionChange={onSelectionChange}
            onSectionUpdate={handleSectionUpdate}
          />
        )}
      </div>
    </div>
  )
}
