import type { Dispatch, SetStateAction } from 'react'
import { SectionBlock } from './section-block'
import type { EditorSelection, Section } from '@/types/editor'

type ArticleEditorProps = {
  selection: EditorSelection
  onSelectionChange: (selection: EditorSelection) => void
  sections: Section[]
  setSections: Dispatch<SetStateAction<Section[]>>
}

export function ArticleEditor({ selection, onSelectionChange, sections }: ArticleEditorProps) {
  const handlePageClick = () => {
    onSelectionChange({ type: 'none' })
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Clickable padding area for selecting "全文" */}
      <div className="flex-1 overflow-y-auto p-8 cursor-default" onClick={handlePageClick}>
        <div className="space-y-4">
          {sections.map((section, index) => (
            <SectionBlock
              key={section.id}
              section={section}
              index={index}
              isSelected={selection.type === 'section' && selection.sectionIndex === index}
              onSelect={() =>
                onSelectionChange({
                  type: 'section',
                  sectionIndex: index,
                  sectionId: section.id,
                  sectionTitle: section.title,
                })
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}
