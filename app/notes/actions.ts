// app/notes/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function deleteNote(formData: FormData) {
  const id = formData.get("id");

  if (!id || typeof id !== "string") {
    throw new Error("Note id is required");
  }

  const supabase = createSupabaseServerClient();


  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete note:", error);
    throw new Error("削除に失敗しました");
  }

  // /notes 一覧を更新
  revalidatePath("/notes");
}
