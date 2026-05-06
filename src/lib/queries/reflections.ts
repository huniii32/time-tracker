import type { ReflectionInsert, ReflectionUpdate } from "@/types";
import type { AppSupabaseClient } from "./client";
import { withUpdatedAt } from "./client";

export async function listReflections(client: AppSupabaseClient, userId: string) {
  return client
    .from("reflections")
    .select("*")
    .eq("user_id", userId)
    .order("reflection_date", { ascending: false });
}

export async function getReflection(
  client: AppSupabaseClient,
  userId: string,
  reflectionId: string,
) {
  return client
    .from("reflections")
    .select("*")
    .eq("user_id", userId)
    .eq("id", reflectionId)
    .single();
}

export async function createReflection(
  client: AppSupabaseClient,
  userId: string,
  payload: Omit<ReflectionInsert, "user_id">,
) {
  return client
    .from("reflections")
    .insert({ ...payload, user_id: userId })
    .select("*")
    .single();
}

export async function updateReflection(
  client: AppSupabaseClient,
  userId: string,
  reflectionId: string,
  payload: ReflectionUpdate,
) {
  return client
    .from("reflections")
    .update(withUpdatedAt(payload))
    .eq("user_id", userId)
    .eq("id", reflectionId)
    .select("*")
    .single();
}

export async function deleteReflection(
  client: AppSupabaseClient,
  userId: string,
  reflectionId: string,
) {
  return client.from("reflections").delete().eq("user_id", userId).eq("id", reflectionId);
}
