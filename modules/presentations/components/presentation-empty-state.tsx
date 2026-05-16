"use client";

import { RefreshCw } from "lucide-react";
import { PresentationEmptyStateProps } from "../types/interfaceAndTypes";
import { Button } from "@/components/ui/button";

export default function PresentationEmptyState({
  isGenerating,
  regeneratePending,
  onRegenerate,
}: PresentationEmptyStateProps) {
  if (isGenerating) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <RefreshCw className="size-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Generating your presentation…</p>
        <p className="text-xs text-muted-foreground mt-1">
          This may take a minute
        </p>
      </div>
    );
  }
  return (
    <div className="glass rounded-2xl p-12 text-center">
      <p className="text-muted-foreground mb-4">
        No slides yet. Click &quot;Regenerate&quot; to create slides from your
        prompt.
      </p>
      <Button
        className="rounded-xl gap-2"
        onClick={onRegenerate}
        disabled={regeneratePending}
      >
        <RefreshCw className="size-4" />
        Generate slides
      </Button>
    </div>
  );
}
