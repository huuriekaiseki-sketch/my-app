// app/notes/actions.ts

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server"; // ← ここを変更

export async function deleteNote(formData: FormData) {
  const supabase = createClient();                // ← ここで使う

  const id = formData.get("id") as string | null;
  if (!id) return;

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteNote error:", error);
    return;
  }

  // 一覧を最新化
  revalidatePath("/notes");
}
