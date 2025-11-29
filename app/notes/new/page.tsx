import { createNote } from "./actions";

export default function NewNotePage() {
  return (
    <div>
      <h1>Create New Note</h1>

      <form action={createNote}>
        <input type="text" name="title" placeholder="Title" />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
