import { Send } from 'lucide-react'

export function ChatPanel() {
  return (
    <div className="flex h-full flex-col bg-white">
      {/* Panel Header */}
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="font-medium text-gray-900">AI 助手</h2>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {/* Example message */}
          <div className="flex flex-col">
            <div className="text-xs text-gray-500 mb-1">你</div>
            <div className="rounded-lg bg-blue-500 text-white px-3 py-2 text-sm">
              让这段更简洁
            </div>
          </div>

          <div className="flex flex-col">
            <div className="text-xs text-gray-500 mb-1">AI</div>
            <div className="rounded-lg bg-gray-100 px-3 py-2 text-sm">
              好的，我已经帮你优化了文案，使其更加简洁明了。
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="输入指令..."
          />
          <button
            type="button"
            className="flex items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
