import type { Dispatch, SetStateAction } from 'react'
import { SectionBlock } from './section-block'
import type { EditorSelection, Section } from '@/types/editor'
import type { ParseResult } from '@/utils/markdown-parser'

type ArticleEditorProps = {
  selection: EditorSelection
  onSelectionChange: (selection: EditorSelection) => void
  sections: Section[]
  setSections: Dispatch<SetStateAction<Section[]>>
}

export function ArticleEditor({ selection, onSelectionChange, sections, setSections }: ArticleEditorProps) {
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
        // Remove current section
        updated.splice(index, 1)
      } else {
        // Replace with new sections
        updated.splice(index, 1, ...result.sections)
      }

      return updated
    })
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
              onUpdate={newSections => handleSectionUpdate(index, newSections)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
