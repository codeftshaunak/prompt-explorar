"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PromptFile, getPromptById } from "@/lib/prompts";
import {
  ArrowLeft,
  Copy,
  Download,
  MessageSquare,
  Calendar,
  Hash,
  Tag,
  ExternalLink,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function PromptPage() {
  const params = useParams();
  const router = useRouter();
  const [prompt, setPrompt] = useState<PromptFile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);

  useEffect(() => {
    async function loadPrompt() {
      if (typeof params.id === "string") {
        try {
          const promptData = await getPromptById(params.id);
          setPrompt(promptData);
        } catch (error) {
          console.error("Error loading prompt:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }

    loadPrompt();
  }, [params.id]);

  const handleCopy = async () => {
    if (prompt) {
      try {
        await navigator.clipboard.writeText(prompt.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }
  };

  const handleDownload = () => {
    if (prompt) {
      const blob = new Blob([prompt.content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${prompt.title.toLowerCase().replace(/\s+/g, "-")}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const shouldTruncate = prompt && prompt.content.length > 3000;
  const displayContent =
    shouldTruncate && !showFullContent
      ? prompt.content.substring(0, 3000) + "..."
      : prompt?.content || "";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading prompt...</p>
        </div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Prompt not found
          </h1>
          <p className="text-muted-foreground mb-4">
            The requested prompt could not be found.
          </p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border glass sticky top-0 z-40 animate-fade-in">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 sm:gap-3 text-muted-foreground hover:text-foreground transition-all duration-200 px-3 sm:px-4 py-2 rounded-lg hover:bg-surface hover:shadow-soft font-medium text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Back to Explorer</span>
              <span className="sm:hidden">Back</span>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
              <button
                onClick={handleCopy}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 font-medium shadow-soft hover:shadow-medium flex-1 sm:flex-none max-w-[120px] sm:max-w-none justify-center ${
                  copied
                    ? "bg-success text-primary-foreground"
                    : "bg-surface hover:bg-surface-hover text-foreground border border-border hover:border-primary/50"
                }`}
              >
                <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium shadow-soft hover:shadow-medium flex-1 sm:flex-none max-w-[120px] sm:max-w-none justify-center"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 max-w-8xl">
        {/* Prompt Header */}
        <div className="mb-6 sm:mb-10 animate-fade-in">
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground mb-4">
            <div className="p-1.5 sm:p-2 bg-surface rounded-lg">
              <Tag className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            </div>
            <span className="font-semibold bg-surface px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
              {prompt.category}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6 tracking-tight leading-tight">
            {prompt.title}
          </h1>

          {prompt.description && (
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed font-medium">
              {prompt.description}
            </p>
          )}

          {/* Metadata */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3 bg-surface px-3 sm:px-4 py-2 sm:py-3 rounded-lg w-full sm:w-auto">
              <Hash className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="font-semibold text-foreground text-sm sm:text-base">
                {prompt.wordCount.toLocaleString()} words
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 bg-surface px-3 sm:px-4 py-2 sm:py-3 rounded-lg w-full sm:w-auto">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="font-semibold text-foreground text-sm sm:text-base">
                <span className="hidden sm:inline">Updated </span>{formatDate(prompt.lastModified)}
              </span>
            </div>
            {prompt.tags.length > 0 && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 bg-surface px-3 sm:px-4 py-2 sm:py-3 rounded-lg w-full sm:w-auto">
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {prompt.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 sm:px-3 py-1 bg-primary/10 text-primary text-xs sm:text-sm rounded-full font-medium border border-primary/20"
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
        <div
          className="bg-card border border-border rounded-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-10 shadow-soft animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              System Prompt
            </h2>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {shouldTruncate && (
                <button
                  onClick={() => setShowFullContent(!showFullContent)}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-primary hover:text-primary-foreground hover:bg-primary rounded-lg transition-all duration-200 font-medium border border-primary/30 hover:border-primary w-full sm:w-auto"
                >
                  {showFullContent ? "Show Less" : "Show Full Content"}
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm leading-relaxed bg-surface border border-border rounded-xl p-4 sm:p-6 overflow-x-auto max-h-[50vh] sm:max-h-[70vh] overflow-y-auto">
              {displayContent}
            </pre>
          </div>
        </div>

        {/* Interaction Section */}
        <div
          className="bg-card border border-border rounded-xl p-4 sm:p-6 lg:p-8 shadow-soft animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
            How to Use This Prompt
          </h2>
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-surface rounded-lg hover:bg-surface-hover transition-colors">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground text-xs sm:text-sm font-bold shadow-soft flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-semibold text-foreground text-base sm:text-lg mb-1 sm:mb-2">
                  Copy the prompt
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  Use the copy button above to copy the full system prompt to
                  your clipboard.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-surface rounded-lg hover:bg-surface-hover transition-colors">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground text-xs sm:text-sm font-bold shadow-soft flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-semibold text-foreground text-base sm:text-lg mb-1 sm:mb-2">
                  Apply to your AI tool
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  Paste this prompt as the system message in your AI application
                  or chatbot.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-surface rounded-lg hover:bg-surface-hover transition-colors">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground text-xs sm:text-sm font-bold shadow-soft flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-semibold text-foreground text-base sm:text-lg mb-1 sm:mb-2">
                  Customize as needed
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  Modify the prompt to fit your specific use case and
                  requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
