// app/notes/data.ts

import { createClient } from "@/lib/supabase/server";  // ← ここ

export async function fetchNotes() {
  const supabase = createClient();                    // ← ここ

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchNotes error:", error);
    return [];
  }

  return data ?? [];
}
