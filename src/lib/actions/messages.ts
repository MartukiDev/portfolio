"use server";

import { adminContent } from "@/content/es/admin-content";
import { requireAdmin } from "@/lib/auth/require-admin";
import { deleteById, idSchema, notFound, writeResult } from "./helpers";
import type { ActionResult } from "./result";

const t = adminContent.messages.toasts;

export async function setMessageRead(id: string, leido: boolean): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!idSchema.safeParse(id).success || typeof leido !== "boolean") return notFound;
  return writeResult(
    await supabase.from("messages").update({ leido }).eq("id", id).select("id"),
    leido ? t.read : t.unread,
  );
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const failure = await deleteById(supabase, "messages", id);
  return failure ?? { ok: true, message: t.deleted };
}
