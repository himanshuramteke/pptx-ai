"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  createPresentationInputSchema,
  presentationIdInputSchema,
  updatePresentationInputSchema,
} from "./../types/zod.schema";
import prisma from "@/lib/db";

async function requireUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  return session.user.id;
}

function deriveTitle(prompt: string) {
  return prompt.slice(0, 60).trim() + (prompt.length > 60 ? "..." : "");
}

export async function createPresentation(raw: unknown) {
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

  //TODO: Inngest function

  return { success: true, data: presentation };
}

export async function updatePresentation(raw: unknown) {
  const data = updatePresentationInputSchema.parse(raw);
  const userId = await requireUserId();

  const { id, ...patch } = data;

  const existing = await prisma.presentation.findFirst({
    where: {
      id,
      userId,
    },
  });
  if (!existing) throw new Error("Not found!");

  return prisma.presentation.update({
    where: { id },
    data: patch,
  });
}

export async function deletePresentation(raw: unknown) {
  const { id } = presentationIdInputSchema.parse(raw);
  const userId = await requireUserId();

  const existing = await prisma.presentation.findMany({
    where: { id, userId },
  });
  if (!existing) throw new Error("Not found!");

  await prisma.presentation.delete({ where: { id } });
  return { ok: true as const };
}

export async function regeneratePresentation(raw: unknown) {
  const { id } = presentationIdInputSchema.parse(raw);
  const userId = await requireUserId();

  const existing = await prisma.presentation.findFirst({
    where: { id, userId },
  });
  if (!existing) throw new Error("Not found!");

  await prisma.presentation.update({
    where: { id },
    data: { status: "GENERATING" },
  });
}
