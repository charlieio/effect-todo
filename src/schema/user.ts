import { Schema } from "effect";

export const user = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  email: Schema.String,
});
