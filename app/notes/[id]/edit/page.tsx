import EditForm from "./EditForm";

export default function Page() {
  const testNote = { title: "Test title" };

  return (
    <div style={{ padding: 16 }}>
      <h1>Edit Note</h1>
      <EditForm note={testNote} />
    </div>
  );
}
