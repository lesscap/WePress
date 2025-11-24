import type { Section } from '@/types/editor'

/**
 * Parse markdown text into sections
 * Splits by heading lines (starting with #)
 * Content without heading merges into previous section
 */
export type ParseResult = {
  sections: Section[]
  /** Content without heading (to merge with previous section) */
  orphanContent?: string
}

export function parseMarkdownToSections(markdown: string): ParseResult {
  if (!markdown.trim()) {
    return { sections: [] }
  }

  const lines = markdown.split('\n')
  const sections: Section[] = []
  let currentSection: Partial<Section> | null = null
  let orphanContent = ''

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)

    if (headingMatch) {
      // Save previous section if exists
      if (currentSection && currentSection.title) {
        sections.push({
          id: `section-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          title: currentSection.title,
          level: currentSection.level as 1 | 2 | 3 | 4 | 5 | 6,
          body: (currentSection.body || '').trim(),
        })
      }

      // Start new section
      const level = headingMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6
      const title = headingMatch[2].trim()
      currentSection = { level, title, body: '' }
    } else {
      // Add to current section body
      if (currentSection) {
        currentSection.body = (currentSection.body || '') + line + '\n'
      } else {
        // Content without heading - collect as orphan
        orphanContent += line + '\n'
      }
    }
  }

  // Save last section
  if (currentSection && currentSection.title) {
    sections.push({
      id: `section-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: currentSection.title,
      level: currentSection.level as 1 | 2 | 3 | 4 | 5 | 6,
      body: (currentSection.body || '').trim(),
    })
  }

  return {
    sections,
    orphanContent: orphanContent.trim() || undefined,
  }
}

/**
 * Convert section to markdown format
 */
export function sectionToMarkdown(section: Section): string {
  const heading = '#'.repeat(section.level) + ' ' + section.title
  return heading + '\n' + section.body
}
