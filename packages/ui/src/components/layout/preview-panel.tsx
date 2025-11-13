import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

export function PreviewPanel() {
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(true)

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
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-medium text-gray-500">选择模板</div>
          <button
            type="button"
            onClick={() => setIsTemplateSelectorOpen(!isTemplateSelectorOpen)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isTemplateSelectorOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
        {isTemplateSelectorOpen && (
          <>
            <div className="grid grid-cols-5 gap-2 mb-3">
              <button
                type="button"
                className="w-full rounded-lg border border-gray-300 bg-white hover:bg-gray-50 overflow-hidden"
              >
                <div className="h-20 bg-gray-100 flex items-center justify-center">
                  <span className="text-xs text-gray-400">缩略图</span>
                </div>
                <div className="py-1.5 text-xs text-center">简约风</div>
              </button>
              <button
                type="button"
                className="w-full rounded-lg border border-gray-300 bg-white hover:bg-gray-50 overflow-hidden"
              >
                <div className="h-20 bg-gray-100 flex items-center justify-center">
                  <span className="text-xs text-gray-400">缩略图</span>
                </div>
                <div className="py-1.5 text-xs text-center">科技风</div>
              </button>
              <button
                type="button"
                className="w-full rounded-lg border border-gray-300 bg-white hover:bg-gray-50 overflow-hidden"
              >
                <div className="h-20 bg-gray-100 flex items-center justify-center">
                  <span className="text-xs text-gray-400">缩略图</span>
                </div>
                <div className="py-1.5 text-xs text-center">文艺风</div>
              </button>
              <button
                type="button"
                className="w-full rounded-lg border border-gray-300 bg-white hover:bg-gray-50 overflow-hidden"
              >
                <div className="h-20 bg-gray-100 flex items-center justify-center">
                  <span className="text-xs text-gray-400">缩略图</span>
                </div>
                <div className="py-1.5 text-xs text-center">商务风</div>
              </button>
              <button
                type="button"
                className="w-full rounded-lg border border-gray-300 bg-white hover:bg-gray-50 overflow-hidden"
              >
                <div className="h-20 bg-gray-100 flex items-center justify-center">
                  <span className="text-xs text-gray-400">缩略图</span>
                </div>
                <div className="py-1.5 text-xs text-center">清新风</div>
              </button>
            </div>
            <div className="flex justify-end">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  disabled
                >
                  上一页
                </button>
                <span className="text-xs text-gray-500">1/1</span>
                <button
                  type="button"
                  className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  disabled
                >
                  下一页
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
