export function ChatPanel() {
  return (
    <div className="flex h-full flex-col bg-white">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {/* Example message */}
          <div className="flex flex-col">
            <div className="text-xs text-gray-500 mb-1">你</div>
            <div className="rounded-lg bg-blue-500 text-white px-3 py-2 text-sm">让这段更简洁</div>
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
      <div className="border-t border-gray-200 p-3">
        <textarea
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none resize-none"
          placeholder="输入指令..."
          rows={3}
        />
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div>
            <span>Idle</span>
          </div>
          <div>
            <span className="mr-3">Enter 发送</span>
            <span>Shift+Enter 换行</span>
          </div>
        </div>
      </div>
    </div>
  )
}
