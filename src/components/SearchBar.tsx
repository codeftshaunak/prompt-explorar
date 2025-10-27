'use client'

import { Search, X } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export default function SearchBar({ onSearch, placeholder = "Search prompts..." }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-center group">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10 h-11 bg-white border-border focus:border-primary focus:ring-primary/20"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 h-8 w-8 p-0 hover:bg-muted/50 z-10"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  )
}