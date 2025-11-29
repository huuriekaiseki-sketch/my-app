// app/notes/[id]/actions.ts
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/supabase-client";

export async function deleteNote(formData: FormData) {
  const id = formData.get("id") as string | null;

  if (!id) {
    throw new Error("Note id is missing");
  }

  const supabase = createClient();

  const { error } = await supabase.from("notes").delete().eq("id", id);

  if (error) {
    throw new Error("Delete error: " + error.message);
  }

  revalidatePath("/notes");
  redirect("/notes");
}
