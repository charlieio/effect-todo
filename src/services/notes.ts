import { Context, Effect, Schema, Layer } from "effect";
import type { CreateNote, Note, UpdateNote } from "../schema/notes";

export class NoteNotFound extends Schema.TaggedError<NoteNotFound>()(
  "NoteNotFound",
  { id: Schema.String },
) {}

export class Notes extends Context.Service<
  Notes,
  {
    readonly list: () => Effect.Effect<ReadonlyArray<Note>>;
    readonly getById: (id: string) => Effect.Effect<Note, NoteNotFound>;
    readonly create: (input: CreateNote) => Effect.Effect<Note>;
    readonly update: (
      id: string,
      input: UpdateNote,
    ) => Effect.Effect<Note, NoteNotFound>;
    readonly delete: (id: string) => Effect.Effect<void, NoteNotFound>;
  }
>()("notes") {
  static readonly layer = Layer.sync(Notes, () => {
    const store = new Map<string, Note>();
    return {
      list: () => Effect.sync(() => Array.from(store.values())),
      getById: (id: string) => {
        const found = store.get(id);
        if (!found) {
          return Effect.fail(new NoteNotFound({ id }));
        }
        return Effect.succeed(found);
      },
      create: (input: CreateNote) =>
        Effect.sync(() => {
          const now = new Date();
          const created: Note = {
            id: crypto.randomUUID(),
            title: input.title,
            description: input.description,
            createdAt: now,
            updatedAt: now,
          };
          store.set(created.id, created);
          return created;
        }),
      update: (id: string, input: UpdateNote) => {
        const existing = store.get(id);
        if (!existing) {
          return Effect.fail(new NoteNotFound({ id }));
        }
        const updated: Note = {
          ...existing,
          ...input,
          updatedAt: new Date(),
        };
        store.set(id, updated);
        return Effect.succeed(updated);
      },
      delete: (id: string) => {
        if (!store.has(id)) {
          return Effect.fail(new NoteNotFound({ id }));
        }
        store.delete(id);
        return Effect.void;
      },
    };
  });
}
