import { useState, useEffect } from 'react'
import { MobilePreview } from './mobile-preview'
import { TemplateSelector } from './template-selector'

export function PreviewPanel() {
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(true)
  const [currentTime, setCurrentTime] = useState('')

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
      <MobilePreview currentTime={currentTime} />
      <TemplateSelector
        isOpen={isTemplateSelectorOpen}
        onToggle={() => setIsTemplateSelectorOpen(!isTemplateSelectorOpen)}
      />
    </div>
  )
}
