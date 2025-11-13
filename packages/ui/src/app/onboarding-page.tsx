import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function OnboardingPage() {
  const [content, setContent] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!content.trim()) return

    setIsProcessing(true)
    try {
      // TODO: 调用 LLM API 处理文章
      // const sections = await processArticle(content)

      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1500))

      // TODO: 保存 sections 到状态管理
      // setSections(sections)

      // 跳转到编辑器页
      navigate('/editor')
    } catch (error) {
      console.error('处理文章失败:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-3xl px-6">
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-3xl font-bold text-gray-900">欢迎使用 WePress</h1>
          <p className="text-gray-600">
            粘贴你的文章内容，我们会智能分析并生成精美的公众号排版
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="在这里粘贴你的文章内容..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none resize-none"
            rows={16}
            disabled={isProcessing}
          />

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {content.length} 字
            </div>
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isProcessing}
              className="rounded-lg bg-blue-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? '处理中...' : '开始创作'}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          支持的内容类型：文章、博客、新闻稿等各类文本内容
        </div>
      </div>
    </div>
  )
}
