import { lazy, Suspense } from 'react'

type MarkedProps = {
  content: string
}

const MarkedContent = lazy(() =>
  import('marked').then(({ marked }) => {
    // Configure marked options
    marked.setOptions({
      breaks: true,
      gfm: true,
    })

    return {
      default: ({ content }: MarkedProps) => {
        const html = marked(content) as string
        return <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
      },
    }
  }),
)

export function Marked({ content }: MarkedProps) {
  return (
    <Suspense fallback={<div className="text-gray-400 text-sm">加载中...</div>}>
      <MarkedContent content={content} />
    </Suspense>
  )
}
