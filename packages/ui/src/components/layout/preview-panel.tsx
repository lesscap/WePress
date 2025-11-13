export function PreviewPanel() {
  return (
    <div className="flex h-full flex-col bg-gray-50">
      {/* Mobile Preview Container */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="relative h-full w-full max-w-[375px]">
          {/* Phone Frame */}
          <div className="flex h-full flex-col overflow-hidden rounded-3xl border-8 border-gray-800 bg-white shadow-2xl">
            {/* Status Bar */}
            <div className="flex h-6 items-center justify-between bg-white px-4 text-xs">
              <span>9:41</span>
              <div className="flex gap-1">
                <span>📶</span>
                <span>📡</span>
                <span>🔋</span>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto bg-white p-4">
              <div className="text-sm text-gray-400">
                文章预览区域
                <br />
                选择模板后将显示渲染效果
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Selector */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="text-xs font-medium text-gray-500 mb-2">选择模板</div>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
          >
            简约风
          </button>
          <button
            type="button"
            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
          >
            科技风
          </button>
          <button
            type="button"
            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
          >
            文艺风
          </button>
        </div>
      </div>
    </div>
  )
}
