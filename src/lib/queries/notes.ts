import type { NoteInsert, NoteType, NoteUpdate } from "@/types";
import type { AppSupabaseClient } from "./client";
import { withUpdatedAt } from "./client";

export async function listNotes(client: AppSupabaseClient, userId: string) {
  return client
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false });
}

export async function listNotesByType(
  client: AppSupabaseClient,
  userId: string,
  noteType: NoteType,
) {
  return client
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .eq("note_type", noteType)
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false });
}

export async function getNote(client: AppSupabaseClient, userId: string, noteId: string) {
  return client.from("notes").select("*").eq("user_id", userId).eq("id", noteId).single();
}

export async function createNote(
  client: AppSupabaseClient,
  userId: string,
  payload: Omit<NoteInsert, "user_id">,
) {
  return client
    .from("notes")
    .insert({ ...payload, user_id: userId })
    .select("*")
    .single();
}

export async function updateNote(
  client: AppSupabaseClient,
  userId: string,
  noteId: string,
  payload: NoteUpdate,
) {
  return client
    .from("notes")
    .update(withUpdatedAt(payload))
    .eq("user_id", userId)
    .eq("id", noteId)
    .select("*")
    .single();
}

export async function deleteNote(client: AppSupabaseClient, userId: string, noteId: string) {
  return client.from("notes").delete().eq("user_id", userId).eq("id", noteId);
}
