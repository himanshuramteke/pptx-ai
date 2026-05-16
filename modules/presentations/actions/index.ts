"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  createPresentationInputSchema,
  presentationIdInputSchema,
  updatePresentationInputSchema,
} from "../types/zod.schema";
import prisma from "@/lib/db";
import type { Presentation } from "@/lib/generated/prisma/client";
import { inngest } from "@/inngest/client";

type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

async function requireUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  return session.user.id;
}

function deriveTitle(prompt: string) {
  return prompt.slice(0, 60).trim() + (prompt.length > 60 ? "..." : "");
}

export async function createPresentation(
  raw: unknown,
): Promise<ActionResponse<Presentation>> {
  try {
    const data = createPresentationInputSchema.parse(raw);
    const userId = await requireUserId();

    const presentation = await prisma.presentation.create({
      data: {
        userId,
        title: deriveTitle(data.prompt),
        prompt: data.prompt,
        slideCount: data.slideCount,
        style: data.style,
        tone: data.tone,
        layout: data.layout,
        status: "GENERATING",
      },
    });

    await inngest.send({
      name: "presentation/generate",
      data: { presentation: presentation.id },
    });

<<<<<<< Updated upstream
  return presentation;
=======
    return { success: true as const, data: presentation };
  } catch (e) {
    return {
      success: false as const,
      error: e instanceof Error ? e.message : "Could not create presentation",
    };
  }
>>>>>>> Stashed changes
}

export async function updatePresentation(
  raw: unknown,
): Promise<ActionResponse<Presentation>> {
  try {
    const data = updatePresentationInputSchema.parse(raw);
    const userId = await requireUserId();

    const { id, ...patch } = data;

    const existing = await prisma.presentation.findFirst({
      where: { id, userId },
    });
    if (!existing) throw new Error("Presentation not found");

    const updated = await prisma.presentation.update({
      where: { id },
      data: patch,
    });

    return { success: true as const, data: updated };
  } catch (e) {
    return {
      success: false as const,
      error: e instanceof Error ? e.message : "Could not update presentation",
    };
  }
}

export async function deletePresentation(
  raw: unknown,
): Promise<ActionResponse<{ ok: true }>> {
  try {
    const { id } = presentationIdInputSchema.parse(raw);
    const userId = await requireUserId();

    const existing = await prisma.presentation.findFirst({
      where: { id, userId },
    });
    if (!existing) throw new Error("Presentation not found");

    await prisma.presentation.delete({ where: { id } });

    return { success: true as const, data: { ok: true as const } };
  } catch (e) {
    return {
      success: false as const,
      error: e instanceof Error ? e.message : "Could not delete presentation",
    };
  }
}

export async function regeneratePresentation(
  raw: unknown,
): Promise<ActionResponse<{ ok: true }>> {
  try {
    const { id } = presentationIdInputSchema.parse(raw);
    const userId = await requireUserId();

    const existing = await prisma.presentation.findFirst({
      where: { id, userId },
    });
    if (!existing) throw new Error("Presentation not found");

    await prisma.presentation.update({
      where: { id },
      data: { status: "GENERATING" },
    });

    await inngest.send({
      name: "presentation/generate",
      data: { presentation: id },
    });

    return { success: true as const, data: { ok: true as const } };
  } catch (e) {
    return {
      success: false as const,
      error:
        e instanceof Error ? e.message : "Could not regenerate presentation",
    };
  }
}
