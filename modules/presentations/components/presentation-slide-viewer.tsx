"use client";

import { Button } from "@/components/ui/button";
import { PresentationSlideViewerProps } from "../types/interfaceAndTypes";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PresentationSlideViewer({
  slides,
  activeIndex,
  onNext,
  onPrev,
}: PresentationSlideViewerProps) {
  const activeSlide = slides[activeIndex];
  if (!activeSlide) return null;
  return (
    <div className="space-y-3">
      {/* <SlidePreview slide={activeSlide} /> */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl gap-1"
          disabled={activeIndex === 0}
          onClick={onPrev}
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          {activeIndex + 1} / {slides.length}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl gap-1"
          disabled={activeIndex >= slides.length - 1}
          onClick={onNext}
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
