import { Schema } from "effect";

export const note = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
  description: Schema.String,
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
});

export const folder = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  description: Schema.String,
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
  notes: Schema.Array(note),
});

export const createNote = Schema.Struct({
  title: Schema.String,
  description: Schema.String,
});

export const updateNote = Schema.Struct({
  title: Schema.optional(Schema.String),
  description: Schema.optional(Schema.String),
});

export type Note = typeof note.Type;
export type CreateNote = typeof createNote.Type;
export type UpdateNote = typeof updateNote.Type;

export const updateFolder = Schema.Struct({
  name: Schema.optional(Schema.String),
  description: Schema.optional(Schema.String),
  notes: Schema.optional(Schema.Array(note)),
});
