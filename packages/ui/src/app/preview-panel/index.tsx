import { useState, useEffect } from 'react'
import type { Section } from '@/types/editor'
import type { Template } from '@/types/template'
import { MobilePreview } from './mobile-preview'
import { TemplateSelector } from './template-selector'

type PreviewPanelProps = {
  sections: Section[]
}

export function PreviewPanel({ sections }: PreviewPanelProps) {
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(true)
  const [currentTime, setCurrentTime] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      setCurrentTime(`${hours}:${minutes}`)
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <MobilePreview currentTime={currentTime} sections={sections} template={selectedTemplate} />
      <TemplateSelector
        isOpen={isTemplateSelectorOpen}
        onToggle={() => setIsTemplateSelectorOpen(!isTemplateSelectorOpen)}
        selectedTemplate={selectedTemplate}
        onSelectTemplate={setSelectedTemplate}
      />
    </div>
  )
}
