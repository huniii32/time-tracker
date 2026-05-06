import type { UserSettingsInsert } from "@/types";
import type { AppSupabaseClient } from "./client";
import { withUpdatedAt } from "./client";

export async function getUserSettings(client: AppSupabaseClient, userId: string) {
  return client.from("user_settings").select("*").eq("user_id", userId).maybeSingle();
}

export async function upsertUserSettings(
  client: AppSupabaseClient,
  userId: string,
  payload: Omit<UserSettingsInsert, "user_id">,
) {
  return client
    .from("user_settings")
    .upsert(withUpdatedAt({ ...payload, user_id: userId }), { onConflict: "user_id" })
    .select("*")
    .single();
}
