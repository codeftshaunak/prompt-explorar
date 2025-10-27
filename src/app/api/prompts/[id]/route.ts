import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { PromptFile } from '../route'

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
  return prompts
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const prompts = getAllPrompts()
    const prompt = prompts.find(p => p.id === id)

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    return NextResponse.json(prompt)
  } catch (error) {
    console.error('Error fetching prompt:', error)
    return NextResponse.json({ error: 'Failed to fetch prompt' }, { status: 500 })
  }
}