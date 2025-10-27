"use client";

import { PromptFile } from "@/lib/prompts";
import PromptCard from "@/components/PromptCard";

interface VirtualizedPromptListProps {
  prompts: PromptFile[];
  itemHeight?: number;
  containerHeight?: number;
  overscan?: number;
  gap?: number;
}

export default function VirtualizedPromptList({
  prompts,
}: VirtualizedPromptListProps) {
  return (
    <div
      className="space-y-4 animate-fade-in"
      style={{ animationDelay: "0.3s" }}
    >
      {prompts.map((prompt, index) => (
        <div
          key={prompt.id}
          className="animate-fade-in"
          style={{ animationDelay: `${0.4 + index * 0.05}s` }}
        >
          <PromptCard prompt={prompt} />
        </div>
      ))}
    </div>
  );
}
