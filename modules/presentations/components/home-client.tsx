"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Wand2 } from "lucide-react";
import { useState, useTransition } from "react";
import {
  LAYOUT_OPTIONS,
  SLIDE_STYLES,
  TONE_OPTIONS,
} from "../constants/presentation-options";
import { PRESENTATION_TEMPLATES } from "../constants/presentation-templates";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createPresentation } from "../actions";

type FormState = {
  content: string;
  slideCount: number;
  style: string;
  tone: string;
  layout: string;
};

export default function HomeClient() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<FormState>({
    content: "",
    slideCount: 8,
    style: "minimal",
    tone: "formal",
    layout: "balanced",
  });

  const handleGenerate = () => {
    if (!form.content.trim()) {
      toast.error("Please enter your content first");
      return;
    }

    startTransition(async () => {
      const result = await createPresentation({
        prompt: form.content.trim(),
        slideCount: form.slideCount,
        style: form.style,
        tone: form.tone,
        layout: form.layout,
      });
      if (!result.success) {
        toast.error("Error creating presentation");
        return;
      }

      toast.success("Presentation created");
      router.refresh();
      router.push(`/presentation/${result.data.id}`);
    });
  };

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* <PresentationListSection presentations={presentations} /> */}

        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            What do you want to{" "}
            <span className="text-gradient-peach">create?</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Enter your content and we&apos;ll generate a beautiful presentation
          </p>
        </div>

        <div className="glass rounded-3xl p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <Textarea
              placeholder="Describe your presentation topic..."
              value={form.content}
              onChange={(e) =>
                setForm((s) => ({ ...s, content: e.target.value }))
              }
              className="h-50 px-3 py-4 min-h-50 max-h-50 overflow-y-auto text-base bg-background/50 border-border/50 rounded-2xl resize-none"
            />
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>{form.content.length.toLocaleString()} characters</span>
              <span>Markdown supported</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2.5">
              <Label>Slides: {form.slideCount}</Label>
              <Slider
                value={[form.slideCount]}
                onValueChange={([v]) =>
                  setForm((s) => ({ ...s, slideCount: v }))
                }
                min={3}
                max={20}
                step={1}
              />
            </div>

            {[
              { key: "style", options: SLIDE_STYLES },
              { key: "tone", options: TONE_OPTIONS },
              { key: "layout", options: LAYOUT_OPTIONS },
            ].map(({ key, options }) => (
              <div key={key} className="space-y-2.5">
                <Label className="capitalize">{key}</Label>
                <Select
                  value={form[key as keyof FormState] as string}
                  onValueChange={(value) =>
                    setForm((s) => ({ ...s, [key]: value }))
                  }
                >
                  <SelectTrigger className="bg-background/50 border-border/50 px-3 py-4">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={isPending || !form.content.trim()}
              className="rounded-xl px-8 gap-2 font-semibold"
            >
              {isPending ? (
                <>
                  <Sparkles className="size-5 animate-pulse" /> Creating…
                </>
              ) : (
                <>
                  <Wand2 className="size-5" /> Generate PPT
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-center text-sm text-muted-foreground mb-3">
            Try a template
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {PRESENTATION_TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() =>
                  setForm({
                    content: t.content,
                    slideCount: t.slides,
                    style: t.style,
                    tone: t.tone,
                    layout: t.layout,
                  })
                }
                className="px-4 py-2 text-sm rounded-full border border-border/50 bg-card/50 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
