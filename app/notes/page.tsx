// app/notes/page.tsx
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { deleteNote } from "./actions";

export default async function NotesPage() {
  const supabase = createSupabaseServerClient();

  const { data: notes, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return <div>ノートの取得に失敗しました。</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Notes</h1>
        <Link
          href="/notes/new"
          className="border px-3 py-1 rounded text-sm"
        >
          New
        </Link>
      </div>

      {(!notes || notes.length === 0) && (
        <p>まだノートがありません。</p>
      )}

      {notes?.map((note) => (
        <div
          key={note.id}
          className="flex items-center justify-between border p-3 rounded"
        >
          <div>
            <Link
              href={`/notes/${note.id}/edit`}
              className="font-semibold"
            >
              {note.title}
            </Link>
            <p className="text-sm text-gray-500">{note.content}</p>
          </div>

          {/* 🔥 ここが Delete ボタン */}
          <form action={deleteNote}>
            <input type="hidden" name="id" value={note.id} />
            <button
              type="submit"
              className="text-sm border px-2 py-1 rounded"
            >
              Delete
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
