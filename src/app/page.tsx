'use client'

import { useState, useEffect } from 'react'
import { PromptFile, PromptCategory, getAllPrompts, getCategories, searchPrompts } from '@/lib/prompts'
import SearchBar from '@/components/SearchBar'
import PromptCard from '@/components/PromptCard'
import CategoryFilter from '@/components/CategoryFilter'
import { Cpu, GitBranch, Users, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function HomePage() {
  const [prompts, setPrompts] = useState<PromptFile[]>([])
  const [filteredPrompts, setFilteredPrompts] = useState<PromptFile[]>([])
  const [categories, setCategories] = useState<PromptCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [promptsData, categoriesData] = await Promise.all([
          getAllPrompts(),
          getCategories()
        ])

        setPrompts(promptsData)
        setFilteredPrompts(promptsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    let filtered = prompts

    if (selectedCategory) {
      filtered = filtered.filter(prompt => prompt.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(prompt =>
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredPrompts(filtered)
  }, [prompts, selectedCategory, searchQuery])

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
  }

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category)
  }

  const totalPrompts = prompts.length
  const totalCategories = categories.length
  const totalWords = prompts.reduce((sum, prompt) => sum + prompt.wordCount, 0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading prompts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border backdrop-blur-xl bg-white/80 sticky top-0 z-40 animate-fade-in shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 animate-slide-in">
              <div className="relative p-2 bg-gradient-to-br from-primary via-primary to-primary/90 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">
                  AI Prompts Explorer
                </h1>
                <p className="text-sm text-muted-foreground font-medium">
                  Discover system prompts from 30+ AI tools and platforms
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className="px-4 py-2 bg-gradient-to-r from-primary/5 to-primary/10 text-primary border border-primary/20 rounded-xl hover:from-primary/10 hover:to-primary/20 hover:border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-sm"
              >
                <GitBranch className="h-4 w-4 mr-2" />
                {totalCategories} categories
              </Badge>
              <Badge
                variant="secondary"
                className="px-4 py-2 bg-gradient-to-r from-primary/5 to-primary/10 text-primary border border-primary/20 rounded-xl hover:from-primary/10 hover:to-primary/20 hover:border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-sm"
              >
                <Users className="h-4 w-4 mr-2" />
                {totalPrompts} prompts
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-10">
        <div className="flex gap-10">
          {/* Sidebar */}
          <aside className="w-80 flex-shrink-0">
            <div className="sticky top-32 space-y-6 animate-slide-in" style={{ animationDelay: '0.1s' }}>
              {/* Search */}
              <Card className="bg-white border-border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Search Prompts</CardTitle>
                  <CardDescription>Find the perfect AI prompt for your needs</CardDescription>
                </CardHeader>
                <CardContent>
                  <SearchBar onSearch={handleSearch} />
                </CardContent>
              </Card>

              {/* Categories */}
              <Card className="bg-white border-border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Categories</CardTitle>
                  <CardDescription>Browse prompts by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategorySelect={handleCategorySelect}
                  />
                </CardContent>
              </Card>

              {/* Stats */}
              <Card className="bg-white border-border shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Statistics
                  </CardTitle>
                  <CardDescription>Collection overview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-secondary/50 to-secondary/80 rounded-xl border border-border/50 hover:from-primary/5 hover:to-primary/10 hover:border-primary/20 transition-all duration-300 hover:scale-[1.02]">
                    <span className="text-muted-foreground font-medium">Total prompts</span>
                    <Badge variant="secondary" className="bg-gradient-to-r from-primary/8 to-primary/12 text-primary border border-primary/20 rounded-lg hover:from-primary/12 hover:to-primary/16 transition-all duration-300">
                      {totalPrompts}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-secondary/50 to-secondary/80 rounded-xl border border-border/50 hover:from-primary/5 hover:to-primary/10 hover:border-primary/20 transition-all duration-300 hover:scale-[1.02]">
                    <span className="text-muted-foreground font-medium">Categories</span>
                    <Badge variant="secondary" className="bg-gradient-to-r from-primary/8 to-primary/12 text-primary border border-primary/20 rounded-lg hover:from-primary/12 hover:to-primary/16 transition-all duration-300">
                      {totalCategories}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-secondary/50 to-secondary/80 rounded-xl border border-border/50 hover:from-primary/5 hover:to-primary/10 hover:border-primary/20 transition-all duration-300 hover:scale-[1.02]">
                    <span className="text-muted-foreground font-medium">Total words</span>
                    <Badge variant="secondary" className="bg-gradient-to-r from-primary/8 to-primary/12 text-primary border border-primary/20 rounded-lg hover:from-primary/12 hover:to-primary/16 transition-all duration-300">
                      {totalWords.toLocaleString()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1">
            <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-3xl font-bold text-foreground mb-3 tracking-tight">
                {selectedCategory || 'All Prompts'}
              </h2>
              <p className="text-lg text-muted-foreground font-medium">
                {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? 's' : ''} found
                {searchQuery && (
                  <span className="text-primary font-semibold"> for "{searchQuery}"</span>
                )}
              </p>
            </div>

            {filteredPrompts.length > 0 ? (
              <div className="grid gap-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                {filteredPrompts.map((prompt, index) => (
                  <div
                    key={prompt.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                  >
                    <PromptCard prompt={prompt} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 animate-fade-in">
                <div className="p-8 bg-card border border-border rounded-xl shadow-soft inline-block">
                  <div className="text-xl text-muted-foreground mb-4 font-medium">No prompts found</div>
                  {searchQuery && (
                    <button
                      onClick={() => handleSearch('')}
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium shadow-soft hover:shadow-medium"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}