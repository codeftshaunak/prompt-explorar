import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface PromptFile {
  id: string
  title: string
  category: string
  content: string
  description?: string
  tags: string[]
  filePath: string
  wordCount: number
  lastModified: string
}

const PROMPTS_DIR = path.join(process.cwd(), 'data', 'prompts')

function getAllPrompts(): PromptFile[] {
  const prompts: PromptFile[] = []

  function scanDirectory(dir: string, category: string = '') {
    try {
      const items = fs.readdirSync(dir)

      for (const item of items) {
        const fullPath = path.join(dir, item)
        const stat = fs.statSync(fullPath)

        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'prompt-explorer') {
          const categoryName = category ? `${category}/${item}` : item
          scanDirectory(fullPath, categoryName)
        } else if (item.endsWith('.txt') || item.endsWith('.md')) {
          try {
            const content = fs.readFileSync(fullPath, 'utf-8')
            const { data, content: markdownContent } = matter(content)

            const finalCategory = category || path.basename(path.dirname(fullPath))
            const title = data.title || path.basename(item, path.extname(item))

            prompts.push({
              id: `${finalCategory}-${path.basename(item, path.extname(item))}`.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
              title: title.replace(/[-_]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
              category: finalCategory,
              content: markdownContent || content,
              description: data.description,
              tags: data.tags || [],
              filePath: fullPath,
              wordCount: (markdownContent || content).split(/\s+/).length,
              lastModified: stat.mtime.toISOString()
            })
          } catch (error) {
            console.warn(`Error reading file ${fullPath}:`, error)
          }
        }
      }
    } catch (error) {
      console.warn(`Error scanning directory ${dir}:`, error)
    }
  }

  scanDirectory(PROMPTS_DIR)
  return prompts.sort((a, b) => a.title.localeCompare(b.title))
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('search')
    const category = searchParams.get('category')

    let prompts = getAllPrompts()

    // Filter by category
    if (category) {
      prompts = prompts.filter(prompt => prompt.category === category)
    }

    // Filter by search query
    if (query) {
      const lowercaseQuery = query.toLowerCase()
      prompts = prompts.filter(prompt =>
        prompt.title.toLowerCase().includes(lowercaseQuery) ||
        prompt.category.toLowerCase().includes(lowercaseQuery) ||
        prompt.content.toLowerCase().includes(lowercaseQuery) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      )
    }

    return NextResponse.json(prompts)
  } catch (error) {
    console.error('Error fetching prompts:', error)
    return NextResponse.json({ error: 'Failed to fetch prompts' }, { status: 500 })
  }
}