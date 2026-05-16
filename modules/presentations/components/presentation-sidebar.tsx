"use client";

import { PresentationSidebarProps } from "../types/interfaceAndTypes";

export default function PresentationSidebar({
  slides,
  activeIndex,
  onSelect,
}: PresentationSidebarProps) {
  if (!slides.length) return null;

  return (
    <aside className="lg:w-80 xl:w-96 flex flex-col">
      <h2 className="font-medium text-sm px-2 pb-3 text-muted-foreground">
        Slides
      </h2>
      <div className="flex-1 overflow-y-auto space-y-4 max-h-[calc(100vh-14rem)] pr-2">
        {/* {slides.map((slide, i) => (
          <SlideCard
            key={slide.id}
            slide={slide}
            isActive={i === activeIndex}
            onClick={() => onSelect(i)}
          />
        ))} */}
      </div>
    </aside>
  );
}
