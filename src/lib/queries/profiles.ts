import type { ProfileInsert, ProfileUpdate } from "@/types";
import type { AppSupabaseClient } from "./client";
import { withUpdatedAt } from "./client";

export async function getProfile(client: AppSupabaseClient, userId: string) {
  return client.from("profiles").select("*").eq("user_id", userId).maybeSingle();
}

export async function upsertProfile(
  client: AppSupabaseClient,
  userId: string,
  payload: Omit<ProfileInsert, "user_id">,
) {
  return client
    .from("profiles")
    .upsert(withUpdatedAt({ ...payload, user_id: userId }), { onConflict: "user_id" })
    .select("*")
    .single();
}

export async function updateProfile(
  client: AppSupabaseClient,
  userId: string,
  payload: ProfileUpdate,
) {
  return client
    .from("profiles")
    .update(withUpdatedAt(payload))
    .eq("user_id", userId)
    .select("*")
    .single();
}
