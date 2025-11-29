"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createNote(formData: FormData) {
  const supabase = createClient();

  const content = formData.get("content")?.toString() ?? "";

  if (!content) return;

  await supabase.from("notes").insert({ content });

  revalidatePath("/notes");
  redirect("/notes");
}
