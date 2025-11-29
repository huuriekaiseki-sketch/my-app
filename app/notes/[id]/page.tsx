// app/notes/[id]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/supabase-client";
import { deleteNote } from "./actions";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function NoteDetailPage({ params }: PageProps) {
  // Next.js 16 では params は Promise なので await する
  const { id } = await params;

  const supabase = createClient();

  const { data: note, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !note) {
    console.error("Note not found:", error?.message);
    notFound();
  }

  return (
    <div>
      <h1>{note.title}</h1>

      {/* Delete ボタン */}
      <form action={deleteNote} style={{ marginTop: "1rem" }}>
        <input type="hidden" name="id" value={note.id} />
        <button type="submit">Delete</button>
      </form>

      {/* ★ これが Edit リンク */}
      <p style={{ marginTop: "1rem" }}>
        <Link href={`/notes/${id}/edit`}>Edit</Link>
      </p>

      {/* 一覧へ戻る */}
      <p style={{ marginTop: "0.5rem" }}>
        <Link href="/notes">← Back to list</Link>
      </p>
    </div>
  );
}
