import { useMemo } from 'react'
import Handlebars from 'handlebars'
import { ChevronLeft, MoreHorizontal, ThumbsUp, MessageCircle, Share2 } from 'lucide-react'
import type { Section } from '@/types/editor'
import type { Template } from '@/types/template'

// Register Handlebars helpers
Handlebars.registerHelper('eq', (a, b) => a === b)

type MobilePreviewProps = {
  currentTime: string
  sections: Section[]
  template: Template | null
}

export function MobilePreview({ currentTime, sections, template }: MobilePreviewProps) {
  const renderedContent = useMemo(() => {
    if (!template || sections.length === 0) return null
    const compile = Handlebars.compile(template.content)
    return compile({ sections })
  }, [template, sections])

  const title = sections.find(s => s.level === 1)?.title || '未命名文章'

  return (
    <div className="flex flex-1 items-center justify-center p-6 min-h-0">
      <div className="relative w-full max-w-[375px] h-full max-h-[700px]">
        {/* Phone Frame */}
        <div className="flex h-full flex-col overflow-hidden rounded-3xl border-8 border-gray-800 bg-white shadow-2xl">
          {/* Status Bar */}
          <div className="flex h-6 items-center justify-between bg-white px-4 text-xs">
            <span className="font-medium">{currentTime}</span>
            <div className="flex gap-1.5 items-center">
              <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="11" width="2" height="4" rx="0.5" />
                <rect x="5" y="8" width="2" height="7" rx="0.5" />
                <rect x="9" y="5" width="2" height="10" rx="0.5" />
                <rect x="13" y="2" width="2" height="13" rx="0.5" />
              </svg>
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 12.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                <path d="M10.5 9a3.5 3.5 0 0 0-5 0" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M12.5 7a6 6 0 0 0-9 0" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
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
            <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{title}</span>
            <MoreHorizontal className="h-5 w-5 text-gray-700" />
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto bg-white">
            {renderedContent ? (
              <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
            ) : (
              <div className="px-5 py-8 text-center text-sm text-gray-400">
                {sections.length === 0 ? '暂无内容，请在编辑器中添加段落' : '请选择一个模板来预览'}
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="border-t border-gray-100 bg-white px-5 py-3">
            <div className="flex items-center justify-around">
              <button type="button" className="flex flex-col items-center gap-1 text-gray-600">
                <ThumbsUp className="h-5 w-5" />
                <span className="text-xs">赞</span>
              </button>
              <button type="button" className="flex flex-col items-center gap-1 text-gray-600">
                <MessageCircle className="h-5 w-5" />
                <span className="text-xs">评论</span>
              </button>
              <button type="button" className="flex flex-col items-center gap-1 text-gray-600">
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
