"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createNote(formData: FormData) {
  const title = formData.get("title") as string;

  if (!title || title.trim() === "") return;

  const supabase = createSupabaseServerClient();

  const { error } = await supabase.from("notes").insert({ title });

  if (error) throw new Error("Supabase insert error: " + error.message);

  revalidatePath("/notes");
  redirect("/notes");
}
