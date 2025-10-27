'use client'

import { PromptCategory } from '@/lib/prompts'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface CategoryFilterProps {
  categories: PromptCategory[]
  selectedCategory: string | null
  onCategorySelect: (category: string | null) => void
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategorySelect
}: CategoryFilterProps) {
  return (
    <div className="space-y-1 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
      <Button
        onClick={() => onCategorySelect(null)}
        variant={selectedCategory === null ? "default" : "ghost"}
        className={`w-full justify-between h-auto p-4 rounded-xl ${
          selectedCategory === null
            ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 shadow-sm border border-primary/20'
            : 'bg-gradient-to-r from-white to-secondary/30 text-foreground hover:from-primary/5 hover:to-primary/10 hover:text-primary border border-border hover:border-primary/30'
        } transition-all duration-300 hover:scale-[1.02]`}
      >
        <span className="font-medium">All Prompts</span>
        <Badge
          variant={selectedCategory === null ? "secondary" : "outline"}
          className={selectedCategory === null
            ? "bg-primary-foreground/20 text-primary-foreground border-0 rounded-lg"
            : "bg-gradient-to-r from-muted/50 to-muted text-muted-foreground border-border rounded-lg hover:from-primary/8 hover:to-primary/12 hover:text-primary transition-all duration-300"
          }
        >
          {categories.reduce((sum, cat) => sum + cat.count, 0)}
        </Badge>
      </Button>

      {categories.map((category) => (
        <Button
          key={category.name}
          onClick={() => onCategorySelect(category.name)}
          variant={selectedCategory === category.name ? "default" : "ghost"}
          className={`w-full justify-between h-auto p-4 rounded-xl ${
            selectedCategory === category.name
              ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 shadow-sm border border-primary/20'
              : 'bg-gradient-to-r from-white to-secondary/30 text-foreground hover:from-primary/5 hover:to-primary/10 hover:text-primary border border-border hover:border-primary/30'
          } transition-all duration-300 hover:scale-[1.02]`}
        >
          <span className="truncate font-medium">{category.name}</span>
          <Badge
            variant={selectedCategory === category.name ? "secondary" : "outline"}
            className={selectedCategory === category.name
              ? "bg-primary-foreground/20 text-primary-foreground border-0 rounded-lg"
              : "bg-gradient-to-r from-muted/50 to-muted text-muted-foreground border-border rounded-lg hover:from-primary/8 hover:to-primary/12 hover:text-primary transition-all duration-300"
            }
          >
            {category.count}
          </Badge>
        </Button>
      ))}
    </div>
  )
}