"use client";

import { Button } from "@/components/ui/button";
import { PresentationHeaderCardProps } from "../types/interfaceAndTypes";
import Link from "next/link";
import { ArrowLeft, Download, Play, RefreshCw } from "lucide-react";

export default function PresentationHeaderCard({
  title,
  slideCount,
  updatedLabel,
  isExporting,
  isGenerating,
  regeneratePending,
  showSettings,
  onExport,
  onRegenerate,
  onToggleSettings,
  onSlideshow,
}: PresentationHeaderCardProps) {
  return (
    <>
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="rounded-xl gap-1"
          >
            <Link href="/">
              <ArrowLeft className="size-4" />
              Home
            </Link>
          </Button>
          {/* <GenerationStatus status={status} /> */}
        </div>
        <span className="text-sm text-muted-foreground">
          Updated {updatedLabel}
        </span>
      </div>

      {/* Header card */}
      <div className="glass rounded-2xl p-4 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold truncate">{title}</h1>
          <p className="text-sm text-muted-foreground">{slideCount} slides</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {slideCount > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl gap-1"
                onClick={onSlideshow}
              >
                <Play className="size-4" />
                <span className="hidden sm:inline">Slideshow</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl gap-1"
                onClick={onExport}
                disabled={isExporting}
              >
                <Download className="size-4" />
                <span className="hidden sm:inline">
                  {isExporting ? "Exporting…" : "Export"}
                </span>
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl gap-1"
            disabled={regeneratePending || isGenerating}
            onClick={onRegenerate}
          >
            <RefreshCw
              className={`size-4 ${isGenerating ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">
              {isGenerating ? "Generating…" : "Regenerate"}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl"
            onClick={onToggleSettings}
          >
            {showSettings ? "Hide settings" : "Edit settings"}
          </Button>
        </div>
      </div>
    </>
  );
}
