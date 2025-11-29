// app/notes/[id]/edit/actions.ts
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/supabase-client";

export async function updateNote(formData: FormData) {
  const id = formData.get("id") as string | null;
  const title = formData.get("title") as string | null;

  if (!id) {
    throw new Error("Note id is missing");
  }

  if (!title || title.trim() === "") {
    // タイトルが空なら何もしない
    return;
  }

  const supabase = createClient();

  const { error } = await supabase
    .from("notes")
    .update({ title })
    .eq("id", id);

  if (error) {
    throw new Error("Update error: " + error.message);
  }

  // 一覧と詳細を更新
  revalidatePath("/notes");
  revalidatePath(`/notes/${id}`);

  // 編集後は詳細ページに戻る
  redirect(`/notes/${id}`);
}
