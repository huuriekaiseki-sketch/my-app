// app/notes/data.ts
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function fetchNotes() {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
