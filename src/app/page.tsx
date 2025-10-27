"use client";

import { useState, useEffect } from "react";
import {
  PromptFile,
  PromptCategory,
  getAllPrompts,
  getCategories,
} from "@/lib/prompts";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import VirtualizedPromptList from "@/components/VirtualizedPromptList";
import {
  GitBranch,
  Users,
  Sparkles,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const [prompts, setPrompts] = useState<PromptFile[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<PromptFile[]>([]);
  const [categories, setCategories] = useState<PromptCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [promptsData, categoriesData] = await Promise.all([
          getAllPrompts(),
          getCategories(),
        ]);

        setPrompts(promptsData);
        setFilteredPrompts(promptsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    let filtered = prompts;

    if (selectedCategory) {
      filtered = filtered.filter(
        (prompt) => prompt.category === selectedCategory
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (prompt) =>
          prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prompt.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prompt.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPrompts(filtered);
  }, [prompts, selectedCategory, searchQuery]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  const totalPrompts = prompts.length;
  const totalCategories = categories.length;
  const totalWords = prompts.reduce((sum, prompt) => sum + prompt.wordCount, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading prompts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border backdrop-blur-xl bg-white/80 sticky top-0 z-40 animate-fade-in shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 md:gap-3 animate-slide-in min-w-0">
              <div className="relative p-1.5 md:p-2 bg-gradient-to-br from-primary via-primary to-primary/90 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex-shrink-0">
                <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 md:w-2.5 md:h-2.5 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-2xl font-bold text-foreground tracking-tight truncate">
                  AI Prompts Explorer
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground font-medium hidden sm:block">
                  Discover system prompts from 30+ AI tools and platforms
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
              <Badge
                variant="secondary"
                className="px-2 md:px-4 py-1 md:py-2 bg-gradient-to-r from-primary/5 to-primary/10 text-primary border border-primary/20 rounded-xl hover:from-primary/10 hover:to-primary/20 hover:border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-sm text-xs md:text-sm"
              >
                <GitBranch className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">
                  {totalCategories} categories
                </span>
                <span className="sm:hidden">{totalCategories}</span>
              </Badge>
              <Badge
                variant="secondary"
                className="px-2 md:px-4 py-1 md:py-2 bg-gradient-to-r from-primary/5 to-primary/10 text-primary border border-primary/20 rounded-xl hover:from-primary/10 hover:to-primary/20 hover:border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-sm text-xs md:text-sm"
              >
                <Users className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">{totalPrompts} prompts</span>
                <span className="sm:hidden">{totalPrompts}</span>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden border-b border-border bg-white/90 backdrop-blur-sm sticky top-[73px] z-30">
        <div className="container mx-auto px-4 py-3">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center justify-between w-full text-left p-3 bg-gradient-to-r from-white to-secondary/30 border border-border rounded-xl hover:from-primary/5 hover:to-primary/10 hover:border-primary/30 transition-all duration-300"
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">
                {selectedCategory ? selectedCategory : "All Categories"}
              </span>
              {selectedCategory && (
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  {filteredPrompts.length}
                </Badge>
              )}
            </div>
            {showMobileFilters ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Filters Panel */}
      {showMobileFilters && (
        <div className="lg:hidden bg-white border-b border-border shadow-sm">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Search Prompts
              </label>
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Mobile Categories - Horizontal Scroll */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Categories
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => handleCategorySelect(null)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl border transition-all duration-300 ${
                    selectedCategory === null
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-white text-foreground border-border hover:border-primary/30 hover:bg-primary/5"
                  }`}
                >
                  <span className="font-medium">All</span>
                  <Badge
                    variant="secondary"
                    className={`ml-2 border-0 ${
                      selectedCategory === null
                        ? "bg-white text-primary"
                        : "bg-white/20 text-current"
                    }`}
                  >
                    {categories.reduce((sum, cat) => sum + cat.count, 0)}
                  </Badge>
                </button>
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handleCategorySelect(category.name)}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl border transition-all duration-300 ${
                      selectedCategory === category.name
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-white text-foreground border-border hover:border-primary/30 hover:bg-primary/5"
                    }`}
                  >
                    <span className="font-medium whitespace-nowrap">
                      {category.name}
                    </span>
                    <Badge
                      variant="secondary"
                      className={`ml-2 border-0 ${
                        selectedCategory === category.name
                          ? "bg-white text-primary"
                          : "bg-white/20 text-current"
                      }`}
                    >
                      {category.count}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-10 bg-background">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* Sidebar - Hidden on mobile */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div
              className="sticky top-32 space-y-6 animate-slide-in"
              style={{ animationDelay: "0.1s" }}
            >
              {/* Search */}
              <Card className="bg-white border-border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Search Prompts</CardTitle>
                  <CardDescription>
                    Find the perfect AI prompt for your needs
                  </CardDescription>
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
                    <span className="text-muted-foreground font-medium">
                      Total prompts
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-primary/8 to-primary/12 text-primary border border-primary/20 rounded-lg hover:from-primary/12 hover:to-primary/16 transition-all duration-300"
                    >
                      {totalPrompts}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-secondary/50 to-secondary/80 rounded-xl border border-border/50 hover:from-primary/5 hover:to-primary/10 hover:border-primary/20 transition-all duration-300 hover:scale-[1.02]">
                    <span className="text-muted-foreground font-medium">
                      Categories
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-primary/8 to-primary/12 text-primary border border-primary/20 rounded-lg hover:from-primary/12 hover:to-primary/16 transition-all duration-300"
                    >
                      {totalCategories}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-secondary/50 to-secondary/80 rounded-xl border border-border/50 hover:from-primary/5 hover:to-primary/10 hover:border-primary/20 transition-all duration-300 hover:scale-[1.02]">
                    <span className="text-muted-foreground font-medium">
                      Total words
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-primary/8 to-primary/12 text-primary border border-primary/20 rounded-lg hover:from-primary/12 hover:to-primary/16 transition-all duration-300"
                    >
                      {totalWords.toLocaleString()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <div
              className="mb-6 md:mb-8 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 md:mb-3 tracking-tight">
                {selectedCategory || "All Prompts"}
              </h2>
              <p className="text-base text-muted-foreground capitalize">
                {filteredPrompts.length} prompt
                {filteredPrompts.length !== 1 ? "s" : ""} found
                {searchQuery && (
                  <span className="text-primary font-semibold">
                    {" "}
                    for "{searchQuery}"
                  </span>
                )}
              </p>
            </div>

            {filteredPrompts.length > 0 ? (
              <VirtualizedPromptList
                prompts={filteredPrompts}
                containerHeight={
                  typeof window !== "undefined"
                    ? Math.max(600, window.innerHeight - 400)
                    : 800
                }
                itemHeight={200}
                gap={16}
              />
            ) : (
              <div className="text-center py-20 animate-fade-in">
                <div className="p-8 bg-card border border-border rounded-xl shadow-soft inline-block">
                  <div className="text-xl text-muted-foreground mb-4 font-medium">
                    No prompts found
                  </div>
                  {searchQuery && (
                    <button
                      onClick={() => handleSearch("")}
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
  );
}
