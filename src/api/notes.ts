import { Schema } from "effect";
import { note, createNote, updateNote } from "../schema/notes";
import {
  HttpApi,
  HttpApiEndpoint,
  HttpApiError,
  HttpApiGroup,
} from "effect/http-api";

export class NotesApiGroup extends HttpApiGroup.make("notes")
  .add(HttpApiEndpoint.get("list", "/", { success: Schema.Array(note) }))
  .add(
    HttpApiEndpoint.get("getById", "/:id", {
      params: { id: Schema.String },
      success: note,
      error: HttpApiError.NotFound,
    }),
  )
  .add(
    HttpApiEndpoint.post("create", "/", {
      payload: createNote,
      success: note,
    }),
  )
  .add(
    HttpApiEndpoint.put("update", "/:id", {
      params: { id: Schema.String },
      payload: updateNote,
      success: note,
    }),
  )
  .add(
    HttpApiEndpoint.delete("delete", "/:id", {
      params: { id: Schema.String },
      success: Schema.Void,
    }),
  )
  .prefix("/notes") {}

export class NotesApi extends HttpApi.make("notes-api").add(NotesApiGroup) {}
