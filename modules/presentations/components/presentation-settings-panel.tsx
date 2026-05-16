"use client";

import { Label } from "@/components/ui/label";
import {
  PresentationSettingsPanelProps,
  SettingsForm,
} from "../types/interfaceAndTypes";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  LAYOUT_OPTIONS,
  SLIDE_STYLES,
  TONE_OPTIONS,
} from "../constants/presentation-options";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Save, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function PresentationSettingsPanel({
  form,
  updatePending,
  deletePending,
  onChange,
  onSave,
  onDelete,
}: PresentationSettingsPanelProps) {
  const set = (patch: Partial<SettingsForm>) => onChange({ ...form, ...patch });

  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Title</Label>
        <input
          value={form.title}
          onChange={(e) => set({ title: e.target.value })}
          className="flex h-10 w-full rounded-xl border border-border/50 bg-background/50 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        />
      </div>

      {/* Prompt */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Prompt</Label>
        <Textarea
          value={form.prompt}
          onChange={(e) => set({ prompt: e.target.value })}
          className="min-h-30 text-sm bg-background/50 border-border/50 rounded-xl resize-y"
        />
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Slides: {form.slideCount}
          </Label>
          <Slider
            value={[form.slideCount]}
            onValueChange={([v]) => set({ slideCount: v })}
            min={3}
            max={20}
            step={1}
            className="py-2"
          />
        </div>
        {[
          { key: "style", options: SLIDE_STYLES },
          { key: "tone", options: TONE_OPTIONS },
          { key: "layout", options: LAYOUT_OPTIONS },
        ].map(({ key, options }) => (
          <div key={key} className="space-y-2">
            <Label className="text-sm font-medium capitalize">{key}</Label>
            <Select
              value={form[key as keyof SettingsForm] as string}
              onValueChange={(value) => set({ [key]: value })}
            >
              <SelectTrigger className="bg-background/50 border-border/50 rounded-xl">
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

      {/* Actions */}
      <div className="flex flex-wrap justify-between gap-3 pt-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="rounded-xl gap-2"
              disabled={deletePending}
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="glass">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete presentation?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                presentation and all its slides.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={onDelete}
              >
                {deletePending ? "Deleting…" : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          type="button"
          size="sm"
          className="rounded-xl gap-2"
          disabled={updatePending || !form.title.trim() || !form.prompt.trim()}
          onClick={onSave}
        >
          <Save className="size-4" />
          {updatePending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
