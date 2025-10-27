"use client";

import { useState, useEffect, useRef, useMemo } from "react";
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
  itemHeight = 220,
  containerHeight = 800,
  overscan = 5,
  gap = 16,
}: VirtualizedPromptListProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const [clientHeight, setClientHeight] = useState(containerHeight);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateClientHeight = () => {
      if (containerRef.current) {
        setClientHeight(containerRef.current.clientHeight);
      }
    };

    updateClientHeight();
    window.addEventListener("resize", updateClientHeight);
    return () => window.removeEventListener("resize", updateClientHeight);
  }, []);

  const visibleRange = useMemo(() => {
    const itemHeightWithGap = itemHeight + gap;
    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / itemHeightWithGap) - overscan
    );
    const endIndex = Math.min(
      prompts.length - 1,
      Math.floor((scrollTop + clientHeight) / itemHeightWithGap) + overscan
    );
    return { startIndex, endIndex };
  }, [scrollTop, clientHeight, itemHeight, gap, prompts.length, overscan]);

  const visibleItems = useMemo(() => {
    return prompts.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [prompts, visibleRange]);

  const totalHeight = prompts.length * (itemHeight + gap) - gap;
  const offsetY = visibleRange.startIndex * (itemHeight + gap);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // If there are fewer than 20 items, don't use virtualization
  if (prompts.length < 20) {
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

  return (
    <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{ height: `${containerHeight}px` }}
      >
        <div style={{ height: `${totalHeight}px`, position: "relative" }}>
          <div
            style={{
              transform: `translateY(${offsetY}px)`,
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            <div className="space-y-4">
              {visibleItems.map((prompt) => (
                <div
                  key={prompt.id}
                  style={{
                    height: `${itemHeight}px`,
                    marginBottom: `${gap}px`,
                  }}
                  className="animate-fade-in"
                >
                  <PromptCard prompt={prompt} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
