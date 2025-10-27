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

export interface PromptCategory {
  name: string
  count: number
  description?: string
}

export async function getAllPrompts(searchQuery?: string, category?: string): Promise<PromptFile[]> {
  try {
    const params = new URLSearchParams()
    if (searchQuery) params.append('search', searchQuery)
    if (category) params.append('category', category)

    const response = await fetch(`/api/prompts?${params.toString()}`)
    if (!response.ok) {
      throw new Error('Failed to fetch prompts')
    }

    const prompts: PromptFile[] = await response.json()
    return prompts.map(prompt => ({
      ...prompt,
      lastModified: prompt.lastModified
    }))
  } catch (error) {
    console.error('Error fetching prompts:', error)
    return []
  }
}

export async function getPromptById(id: string): Promise<PromptFile | null> {
  try {
    const response = await fetch(`/api/prompts/${id}`)
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error('Failed to fetch prompt')
    }

    const prompt: PromptFile = await response.json()
    return {
      ...prompt,
      lastModified: prompt.lastModified
    }
  } catch (error) {
    console.error('Error fetching prompt:', error)
    return null
  }
}

export async function getCategories(): Promise<PromptCategory[]> {
  try {
    const response = await fetch('/api/categories')
    if (!response.ok) {
      throw new Error('Failed to fetch categories')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function searchPrompts(query: string): Promise<PromptFile[]> {
  return getAllPrompts(query)
}