import { ChevronLeft, MoreHorizontal, ThumbsUp, MessageCircle, Share2 } from 'lucide-react'

type MobilePreviewProps = {
  currentTime: string
}

export function MobilePreview({ currentTime }: MobilePreviewProps) {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="relative h-full w-full max-w-[375px]">
        {/* Phone Frame */}
        <div className="flex h-full flex-col overflow-hidden rounded-3xl border-8 border-gray-800 bg-white shadow-2xl">
          {/* Status Bar */}
          <div className="flex h-6 items-center justify-between bg-white px-4 text-xs">
            <span className="font-medium">{currentTime}</span>
            <div className="flex gap-1.5 items-center">
              {/* Mobile Signal */}
              <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="11" width="2" height="4" rx="0.5" />
                <rect x="5" y="8" width="2" height="7" rx="0.5" />
                <rect x="9" y="5" width="2" height="10" rx="0.5" />
                <rect x="13" y="2" width="2" height="13" rx="0.5" />
              </svg>
              {/* WiFi */}
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 12.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                <path d="M10.5 9a3.5 3.5 0 0 0-5 0" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M12.5 7a6 6 0 0 0-9 0" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
              {/* Battery */}
              <svg className="w-5 h-3" viewBox="0 0 24 12" fill="none">
                <rect x="1" y="2" width="18" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="3" y="4" width="14" height="4" rx="0.5" fill="currentColor" />
                <rect x="20" y="4.5" width="2" height="3" rx="0.5" fill="currentColor" />
              </svg>
            </div>
          </div>

          {/* WeChat Article Header */}
          <div className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-2.5">
            <ChevronLeft className="h-5 w-5 text-gray-700" />
            <span className="text-sm font-medium text-gray-900">WePress</span>
            <MoreHorizontal className="h-5 w-5 text-gray-700" />
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto bg-white">
            {/* Article Header */}
            <div className="px-5 pt-5 pb-4 border-b border-gray-100">
              <h1 className="text-xl font-bold text-gray-900 leading-tight mb-3">
                文章标题将在这里显示
              </h1>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>作者名称</span>
                <span>·</span>
                <span>2024-01-15</span>
              </div>
            </div>

            {/* Article Content */}
            <div className="px-5 py-4 text-sm text-gray-700 leading-relaxed">
              <p className="mb-4">
                这里将显示文章的正文内容。选择模板后，内容会按照所选模板的样式进行渲染。
              </p>
              <p className="mb-4">支持多段落排版，图文混排，以及各种富文本格式。</p>
              <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4 text-gray-400 text-xs">
                图片占位
              </div>
              <p>每个模板都有独特的视觉风格，帮助你的内容更好地呈现。</p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="border-t border-gray-100 bg-white px-5 py-3">
            <div className="flex items-center justify-around">
              <button className="flex flex-col items-center gap-1 text-gray-600">
                <ThumbsUp className="h-5 w-5" />
                <span className="text-xs">赞</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-gray-600">
                <MessageCircle className="h-5 w-5" />
                <span className="text-xs">评论</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-gray-600">
                <Share2 className="h-5 w-5" />
                <span className="text-xs">分享</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
