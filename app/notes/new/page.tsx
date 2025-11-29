// app/notes/page.tsx
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";  // ★ここを変更
import { deleteNote } from "./actions";

export default async function NotesPage() {
  const supabase = createClient();                      // ★ここも変更

  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .order("id", { ascending: false });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notes</h1>

      <Link href="/notes/new" className="underline text-blue-600">
        Create New Note
      </Link>

      <ul className="mt-4 space-y-2">
        {notes?.map((note) => (
          <li key={note.id} className="border p-2 flex justify-between">
            <span>{note.title}</span>
            <form action={deleteNote}>
              <input type="hidden" name="id" value={note.id} />
              <button
                type="submit"
                className="text-sm text-red-600 underline"
              >
                削除
              </button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
