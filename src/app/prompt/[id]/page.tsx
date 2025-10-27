'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PromptFile, getPromptById } from '@/lib/prompts'
import { ArrowLeft, Copy, Download, MessageSquare, Calendar, Hash, Tag, ExternalLink } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function PromptPage() {
  const params = useParams()
  const router = useRouter()
  const [prompt, setPrompt] = useState<PromptFile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showFullContent, setShowFullContent] = useState(false)

  useEffect(() => {
    async function loadPrompt() {
      if (typeof params.id === 'string') {
        try {
          const promptData = await getPromptById(params.id)
          setPrompt(promptData)
        } catch (error) {
          console.error('Error loading prompt:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadPrompt()
  }, [params.id])

  const handleCopy = async () => {
    if (prompt) {
      try {
        await navigator.clipboard.writeText(prompt.content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.error('Failed to copy:', error)
      }
    }
  }

  const handleDownload = () => {
    if (prompt) {
      const blob = new Blob([prompt.content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${prompt.title.toLowerCase().replace(/\s+/g, '-')}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString))
  }

  const shouldTruncate = prompt && prompt.content.length > 3000
  const displayContent = shouldTruncate && !showFullContent
    ? prompt.content.substring(0, 3000) + '...'
    : prompt?.content || ''

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading prompt...</p>
        </div>
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Prompt not found</h1>
          <p className="text-muted-foreground mb-4">The requested prompt could not be found.</p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border glass sticky top-0 z-40 animate-fade-in">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-all duration-200 px-4 py-2 rounded-lg hover:bg-surface hover:shadow-soft font-medium"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Explorer
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopy}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all duration-200 font-medium shadow-soft hover:shadow-medium ${
                  copied
                    ? 'bg-success text-primary-foreground'
                    : 'bg-surface hover:bg-surface-hover text-foreground border border-border hover:border-primary/50'
                }`}
              >
                <Copy className="h-4 w-4" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium shadow-soft hover:shadow-medium"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-6 py-10 max-w-5xl">
        {/* Prompt Header */}
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
            <div className="p-2 bg-surface rounded-lg">
              <Tag className="h-4 w-4 text-primary" />
            </div>
            <span className="font-semibold bg-surface px-3 py-1 rounded-full">{prompt.category}</span>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-6 tracking-tight leading-tight">{prompt.title}</h1>

          {prompt.description && (
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed font-medium">{prompt.description}</p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3 bg-surface px-4 py-3 rounded-lg">
              <Hash className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">{prompt.wordCount.toLocaleString()} words</span>
            </div>
            <div className="flex items-center gap-3 bg-surface px-4 py-3 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Updated {formatDate(prompt.lastModified)}</span>
            </div>
            {prompt.tags.length > 0 && (
              <div className="flex items-center gap-3 bg-surface px-4 py-3 rounded-lg">
                <MessageSquare className="h-5 w-5 text-primary" />
                <div className="flex gap-2">
                  {prompt.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Prompt Content */}
        <div className="bg-card border border-border rounded-xl p-8 mb-10 shadow-soft animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">System Prompt</h2>
            <div className="flex items-center gap-3">
              {shouldTruncate && (
                <button
                  onClick={() => setShowFullContent(!showFullContent)}
                  className="px-4 py-2 text-sm text-primary hover:text-primary-foreground hover:bg-primary rounded-lg transition-all duration-200 font-medium border border-primary/30 hover:border-primary"
                >
                  {showFullContent ? 'Show Less' : 'Show Full Content'}
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed bg-surface border border-border rounded-xl p-6 overflow-x-auto max-h-[70vh] overflow-y-auto">
              {displayContent}
            </pre>
          </div>
        </div>

        {/* Interaction Section */}
        <div className="bg-card border border-border rounded-xl p-8 shadow-soft animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            How to Use This Prompt
          </h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-surface rounded-lg hover:bg-surface-hover transition-colors">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground text-sm font-bold shadow-soft">
                1
              </div>
              <div>
                <p className="font-semibold text-foreground text-lg mb-2">Copy the prompt</p>
                <p className="text-muted-foreground leading-relaxed">Use the copy button above to copy the full system prompt to your clipboard.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-surface rounded-lg hover:bg-surface-hover transition-colors">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground text-sm font-bold shadow-soft">
                2
              </div>
              <div>
                <p className="font-semibold text-foreground text-lg mb-2">Apply to your AI tool</p>
                <p className="text-muted-foreground leading-relaxed">Paste this prompt as the system message in your AI application or chatbot.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-surface rounded-lg hover:bg-surface-hover transition-colors">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground text-sm font-bold shadow-soft">
                3
              </div>
              <div>
                <p className="font-semibold text-foreground text-lg mb-2">Customize as needed</p>
                <p className="text-muted-foreground leading-relaxed">Modify the prompt to fit your specific use case and requirements.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}