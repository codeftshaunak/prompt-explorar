import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface PromptCategory {
  name: string
  count: number
  description?: string
}

const PROMPTS_DIR = path.join(process.cwd(), 'data', 'prompts')

function getAllPrompts() {
  const prompts: Array<{ category: string }> = []

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
            const finalCategory = category || path.basename(path.dirname(fullPath))
            prompts.push({ category: finalCategory })
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

export async function GET() {
  try {
    const prompts = getAllPrompts()
    const categoryMap = new Map<string, number>()

    prompts.forEach(prompt => {
      categoryMap.set(prompt.category, (categoryMap.get(prompt.category) || 0) + 1)
    })

    const categories: PromptCategory[] = Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}