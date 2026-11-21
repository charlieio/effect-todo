import { useState } from "react";
import { Effect } from "effect";
import type { Note } from "./schema/notes";
import { Notes } from "./services/notes";
import { runtime } from "./runtime";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState<ReadonlyArray<Note>>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = () => runtime.runPromise(Notes.use((notes) => notes.list()));

  const addNote = () => {
    if (!title.trim()) return;

    setBusy(true);
    setError(null);

    runtime
      .runPromise(
        Notes.use((notes) =>
          Effect.andThen(
            notes.create({
              title: title.trim(),
              description: description.trim(),
            }),
            () => notes.list(),
          ),
        ),
      )
      .then((listed) => {
        setNotes(listed);
        setTitle("");
        setDescription("");
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => setBusy(false));
  };

  const loadNotes = () => {
    setBusy(true);
    setError(null);
    refresh()
      .then(setNotes)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => setBusy(false));
  };

  return (
    <main className="notes-page">
      <h1>Notes</h1>
      <p className="lede">React UI talking to your Effect Notes service</p>

      <form
        className="note-form"
        onSubmit={(event) => {
          event.preventDefault();
          addNote();
        }}
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={busy}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          disabled={busy}
        />
        <button type="submit" disabled={busy || !title.trim()}>
          {busy ? "Saving…" : "Add Note"}
        </button>
      </form>

      <div className="notes-toolbar">
        <button type="button" onClick={loadNotes} disabled={busy}>
          Refresh list
        </button>
      </div>

      {error ? <p className="error">{error}</p> : null}

      <ul className="notes-list">
        {notes.length === 0 ? (
          <li className="empty">No notes yet — add one above</li>
        ) : (
          notes.map((note) => (
            <li key={note.id}>
              <strong>{note.title}</strong>
              <span>{note.description}</span>
            </li>
          ))
        )}
      </ul>
    </main>
  );
}

export default App;
