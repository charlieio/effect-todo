import { ManagedRuntime } from "effect";
import { Notes } from "./services/notes";

// One runtime for the whole Vite app.
// Built once → Notes.layer's Map is shared across every button click.
export const runtime = ManagedRuntime.make(Notes.layer);
