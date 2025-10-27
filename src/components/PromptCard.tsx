'use client'

import { PromptFile } from '@/lib/prompts'
import { FileText, Calendar, Hash } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PromptCardProps {
  prompt: PromptFile
}

export default function PromptCard({ prompt }: PromptCardProps) {
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(dateString))
  }

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength).trim() + '...'
  }

  return (
    <Link href={`/prompt/${prompt.id}`} className="block transition-all duration-300 hover:scale-[1.01] h-full">
      <Card className="group relative overflow-hidden bg-white border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 shadow-sm h-full flex flex-col">
        {/* Elegant accent line */}
        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-primary via-primary/70 to-primary/40 opacity-70 group-hover:opacity-100 group-hover:w-2 transition-all duration-300"></div>

        <CardHeader className="pb-3 md:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
              <div className="p-2 md:p-2.5 bg-primary/8 rounded-xl border border-primary/15 group-hover:bg-primary/12 transition-colors flex-shrink-0">
                <FileText className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
              </div>
              <Badge variant="secondary" className="bg-gradient-to-r from-secondary/80 to-secondary text-secondary-foreground border border-border/50 rounded-lg font-medium hover:from-primary/8 hover:to-primary/12 hover:text-primary transition-all duration-300 text-xs md:text-sm truncate">
                {prompt.category}
              </Badge>
            </div>
            <Badge variant="outline" className="bg-gradient-to-r from-muted/20 to-muted/40 text-muted-foreground border border-border rounded-lg hover:from-primary/8 hover:to-primary/12 hover:text-primary hover:border-primary/20 transition-all duration-300 text-xs md:text-sm flex-shrink-0">
              <Hash className="h-3 w-3 mr-1" />
              {prompt.wordCount} words
            </Badge>
          </div>

          <h3 className="text-lg md:text-xl font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
            {prompt.title}
          </h3>
        </CardHeader>

        <CardContent className="pt-0 flex-1 flex flex-col">
          {prompt.description && (
            <p className="text-sm text-muted-foreground mb-3 md:mb-4 line-clamp-2 leading-relaxed">
              {prompt.description}
            </p>
          )}

          <p className="text-sm text-muted-foreground mb-4 md:mb-6 line-clamp-3 leading-relaxed flex-1">
            {truncateContent(prompt.content)}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-auto">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary flex-shrink-0" />
              <span className="font-medium">{formatDate(prompt.lastModified)}</span>
            </div>

            {prompt.tags.length > 0 && (
              <div className="flex gap-1.5 md:gap-2 flex-wrap">
                {prompt.tags.slice(0, 2).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-gradient-to-r from-primary/5 to-primary/8 text-primary border border-primary/20 rounded-lg hover:from-primary/10 hover:to-primary/15 hover:border-primary/30 transition-all duration-300 text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
                {prompt.tags.length > 2 && (
                  <Badge
                    variant="outline"
                    className="bg-gradient-to-r from-primary/5 to-primary/8 text-primary border border-primary/20 rounded-lg hover:from-primary/10 hover:to-primary/15 hover:border-primary/30 transition-all duration-300 text-xs"
                  >
                    +{prompt.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}