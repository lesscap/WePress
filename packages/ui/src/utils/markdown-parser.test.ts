import { describe, it, expect } from 'vitest'
import { parseMarkdownToSections, sectionToMarkdown } from './markdown-parser'

describe('parseMarkdownToSections', () => {
  it('parses single section', () => {
    const markdown = `## 标题

这是正文内容`

    const result = parseMarkdownToSections(markdown)

    expect(result.sections).toHaveLength(1)
    expect(result.sections[0].title).toBe('标题')
    expect(result.sections[0].level).toBe(2)
    expect(result.sections[0].body).toBe('这是正文内容')
    expect(result.orphanContent).toBeUndefined()
  })

  it('parses multiple sections', () => {
    const markdown = `## 第一段

第一段内容

### 第二段

第二段内容`

    const result = parseMarkdownToSections(markdown)

    expect(result.sections).toHaveLength(2)
    expect(result.sections[0].title).toBe('第一段')
    expect(result.sections[0].level).toBe(2)
    expect(result.sections[1].title).toBe('第二段')
    expect(result.sections[1].level).toBe(3)
  })

  it('merges content without heading to previous section', () => {
    const markdown = `## 标题

第一段内容

这里没有标题
会合并到上面`

    const result = parseMarkdownToSections(markdown)

    expect(result.sections).toHaveLength(1)
    expect(result.sections[0].body).toContain('第一段内容')
    expect(result.sections[0].body).toContain('这里没有标题')
    expect(result.sections[0].body).toContain('会合并到上面')
  })

  it('handles different heading levels', () => {
    const markdown = `# H1 标题

内容1

#### H4 标题

内容2`

    const result = parseMarkdownToSections(markdown)

    expect(result.sections).toHaveLength(2)
    expect(result.sections[0].level).toBe(1)
    expect(result.sections[1].level).toBe(4)
  })

  it('trims whitespace from body', () => {
    const markdown = `## 标题


内容


`

    const result = parseMarkdownToSections(markdown)

    expect(result.sections[0].body).toBe('内容')
  })

  it('handles markdown formatting in body', () => {
    const markdown = `## 标题

这是 **加粗** 和 *斜体* 的内容

- 列表项1
- 列表项2`

    const result = parseMarkdownToSections(markdown)

    expect(result.sections[0].body).toContain('**加粗**')
    expect(result.sections[0].body).toContain('*斜体*')
    expect(result.sections[0].body).toContain('- 列表项1')
  })

  it('returns empty result for empty input', () => {
    const result = parseMarkdownToSections('')
    expect(result.sections).toHaveLength(0)
    expect(result.orphanContent).toBeUndefined()
  })

  it('returns orphan content when no headings', () => {
    const markdown = `这是没有标题的内容
只有正文`

    const result = parseMarkdownToSections(markdown)

    expect(result.sections).toHaveLength(0)
    expect(result.orphanContent).toBe('这是没有标题的内容\n只有正文')
  })
})

describe('sectionToMarkdown', () => {
  it('converts section to markdown format with blank line', () => {
    const section = {
      id: 'test-1',
      title: '测试标题',
      level: 2 as const,
      body: '这是正文内容',
    }

    const markdown = sectionToMarkdown(section)

    expect(markdown).toBe('## 测试标题\n\n这是正文内容')
  })

  it('handles different heading levels', () => {
    const section = {
      id: 'test-1',
      title: 'H4 标题',
      level: 4 as const,
      body: '内容',
    }

    const markdown = sectionToMarkdown(section)

    expect(markdown).toBe('#### H4 标题\n\n内容')
  })
})
