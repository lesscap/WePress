import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { PreviewPanel } from './preview-panel'
import { EditPanel } from './edit-panel'
import { ChatPanel } from './chat-panel'

export function EditorLayout() {
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

        {/* Center: Edit Panel */}
        <ResizablePanel defaultSize={45} minSize={30}>
          <EditPanel />
        </ResizablePanel>

        <ResizableHandle />

        {/* Right: Chat Panel */}
        <ResizablePanel defaultSize={30} minSize={20}>
          <ChatPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
