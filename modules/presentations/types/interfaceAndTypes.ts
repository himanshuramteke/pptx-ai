import { Presentation, Slide } from "@/lib/generated/prisma/client";

export interface PresentationHeaderCardProps {
  title: string;
  slideCount: number;
  status: string;
  updatedLabel: string;
  isExporting: boolean;
  isGenerating: boolean;
  regeneratePending: boolean;
  showSettings: boolean;
  onExport: () => void;
  onRegenerate: () => void;
  onToggleSettings: () => void;
  onSlideshow: () => void;
}

export type SettingsForm = {
  title: string;
  prompt: string;
  slideCount: number;
  style: string;
  tone: string;
  layout: string;
};

export interface PresentationSettingsPanelProps {
  form: SettingsForm;
  updatePending: boolean;
  deletePending: boolean;
  onChange: (form: SettingsForm) => void;
  onSave: () => void;
  onDelete: () => void;
}

export interface PresentationSlideViewerProps {
  slides: Slide[];
  activeIndex: number;
  onNext: () => void;
  onPrev: () => void;
}

export interface PresentationEmptyStateProps {
  isGenerating: boolean;
  regeneratePending: boolean;
  onRegenerate: () => void;
}

export interface PresentationSidebarProps {
  slides: Slide[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export type PresentationWithSlides = Presentation & { slides: Slide[] };
