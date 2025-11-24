// Indentation based on heading level (H1=0, H2=1, H3=2, etc.)
export const indentClass: Record<number, string> = {
  1: 'ml-0',
  2: 'ml-6',
  3: 'ml-12',
  4: 'ml-16',
  5: 'ml-20',
  6: 'ml-24',
}

export function getIndent(level: number): string {
  return indentClass[level] || 'ml-0'
}
