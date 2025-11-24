import { useState, useEffect } from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { PreviewPanel } from '../preview-panel'
import { ArticleEditor } from '../article-editor'
import { AgentPanel } from '../agent-panel'
import type { EditorSelection, Section } from '@/types/editor'

const STORAGE_KEY = 'wepress-article-sections'

function loadSections(): Section[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    return JSON.parse(stored)
  } catch {
    return []
  }
}

function saveSections(sections: Section[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sections))
  } catch {
    // ignore
  }
}

export function EditorLayout() {
  const [selection, setSelection] = useState<EditorSelection>({ type: 'none' })
  const [sections, setSections] = useState<Section[]>(() => loadSections())

  useEffect(() => {
    saveSections(sections)
  }, [sections])

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex h-14 items-center border-b border-gray-200 px-6">
        <h1 className="text-lg font-semibold">WePress</h1>
      </header>

      {/* Three Column Layout */}
      <ResizablePanelGroup direction="horizontal" className="flex-1" autoSaveId="editor-layout">
        {/* Left: Preview Panel */}
        <ResizablePanel defaultSize={25} minSize={15}>
          <PreviewPanel />
        </ResizablePanel>

        <ResizableHandle />

        {/* Center: Article Editor */}
        <ResizablePanel defaultSize={45} minSize={30}>
          <ArticleEditor selection={selection} onSelectionChange={setSelection} sections={sections} setSections={setSections} />
        </ResizablePanel>

        <ResizableHandle />

        {/* Right: Agent Panel */}
        <ResizablePanel defaultSize={30} minSize={20}>
          <AgentPanel selection={selection} sections={sections} setSections={setSections} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
