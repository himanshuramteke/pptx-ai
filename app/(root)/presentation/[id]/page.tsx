"use client";

import { useRouter } from "next/navigation";
import {
  PresentationWithSlides,
  SettingsForm,
} from "@/modules/presentations/types/interfaceAndTypes";
import { useEffect, useState, useTransition } from "react";
import {
  deletePresentation,
  regeneratePresentation,
  updatePresentation,
} from "@/modules/presentations/actions/index";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import PresentationHeaderCard from "@/modules/presentations/components/presentation-header-card";
import PresentationSettingsPanel from "@/modules/presentations/components/presentation-settings-panel";
import PresentationSlideViewer from "@/modules/presentations/components/presentation-slide-viewer";
import PresentationEmptyState from "@/modules/presentations/components/presentation-empty-state";
import PresentationSidebar from "@/modules/presentations/components/presentation-sidebar";

export default function PresentationDetailClient({
  presentation,
}: {
  presentation: PresentationWithSlides;
}) {
  const router = useRouter();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [updatePending, startUpdate] = useTransition();
  const [deletePending, startDelete] = useTransition();
  const [regeneratePending, startRegenerate] = useTransition();

  const isGenerating = presentation.status === "GENERATING";
  const slides = presentation.slides;

  const [form, setForm] = useState<SettingsForm>({
    title: presentation.title,
    prompt: presentation.prompt,
    slideCount: presentation.slideCount,
    style: presentation.style,
    tone: presentation.tone,
    layout: presentation.layout,
  });

  useEffect(() => {
    if (!isGenerating) return;
    const interval = setInterval(() => router.refresh(), 3000);
    return () => clearInterval(interval);
  }, [isGenerating, router]);

  const handleUpdate = () =>
    startUpdate(async () => {
      const result = await updatePresentation({ id: presentation.id, ...form });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Saved");
      router.refresh();
    });

  const handleDelete = () =>
    startDelete(async () => {
      const result = await deletePresentation({ id: presentation.id });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Deleted");
      router.push("/");
    });

  const handleRegenerate = () =>
    startRegenerate(async () => {
      const result = await regeneratePresentation({ id: presentation.id });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Regenerating…");
      router.refresh();
    });

  const handleExport = () => {};

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <PresentationHeaderCard
          title={presentation.title}
          slideCount={slides.length}
          status={presentation.status}
          updatedLabel={formatDistanceToNow(new Date(presentation.updatedAt), {
            addSuffix: true,
          })}
          isExporting={isExporting}
          isGenerating={isGenerating}
          regeneratePending={regeneratePending}
          showSettings={showSettings}
          onExport={handleExport}
          onRegenerate={handleRegenerate}
          onToggleSettings={() => setShowSettings((s) => !s)}
          onSlideshow={() => setShowSlideshow(true)}
        />

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            {showSettings && (
              <PresentationSettingsPanel
                form={form}
                updatePending={updatePending}
                deletePending={deletePending}
                onChange={setForm}
                onSave={handleUpdate}
                onDelete={handleDelete}
              />
            )}

            {slides.length > 0 ? (
              <PresentationSlideViewer
                slides={slides}
                activeIndex={activeSlideIndex}
                onNext={() =>
                  setActiveSlideIndex((i) => Math.min(slides.length - 1, i + 1))
                }
                onPrev={() => setActiveSlideIndex((i) => Math.max(0, i - 1))}
              />
            ) : (
              <PresentationEmptyState
                isGenerating={isGenerating}
                regeneratePending={regeneratePending}
                onRegenerate={handleRegenerate}
              />
            )}
          </div>

          <PresentationSidebar
            slides={slides}
            activeIndex={activeSlideIndex}
            onSelect={setActiveSlideIndex}
          />
        </div>
      </div>

      {/* {showSlideshow && (
        // <SlideshowModal
        //   slides={slides}
        //   initialIndex={activeSlideIndex}
        //   onClose={() => setShowSlideshow(false)}
        // />
      )} */}
    </main>
  );
}
