export default function EditForm({ note }: { note: { title: string } }) {
  return (
    <form className="space-y-2">
      <input
        type="text"
        defaultValue={note.title}
        className="border px-2 py-1 w-full"
      />
      <button className="border px-2 py-1 rounded">
        Update (not wired yet)
      </button>
    </form>
  );
}
