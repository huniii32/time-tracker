import type { TimeLogCategory, TimeLogInsert, TimeLogUpdate } from "@/types";
import type { AppSupabaseClient } from "./client";
import { withUpdatedAt } from "./client";

export async function listTimeLogs(client: AppSupabaseClient, userId: string) {
  return client
    .from("time_logs")
    .select("*")
    .eq("user_id", userId)
    .order("log_date", { ascending: false })
    .order("start_time", { ascending: true });
}

export async function listTimeLogsByCategory(
  client: AppSupabaseClient,
  userId: string,
  category: TimeLogCategory,
) {
  return client.from("time_logs").select("*").eq("user_id", userId).eq("category", category);
}

export async function getTimeLog(
  client: AppSupabaseClient,
  userId: string,
  timeLogId: string,
) {
  return client
    .from("time_logs")
    .select("*")
    .eq("user_id", userId)
    .eq("id", timeLogId)
    .single();
}

export async function createTimeLog(
  client: AppSupabaseClient,
  userId: string,
  payload: Omit<TimeLogInsert, "user_id">,
) {
  return client
    .from("time_logs")
    .insert({ ...payload, user_id: userId })
    .select("*")
    .single();
}

export async function updateTimeLog(
  client: AppSupabaseClient,
  userId: string,
  timeLogId: string,
  payload: TimeLogUpdate,
) {
  return client
    .from("time_logs")
    .update(withUpdatedAt(payload))
    .eq("user_id", userId)
    .eq("id", timeLogId)
    .select("*")
    .single();
}

export async function deleteTimeLog(
  client: AppSupabaseClient,
  userId: string,
  timeLogId: string,
) {
  return client.from("time_logs").delete().eq("user_id", userId).eq("id", timeLogId);
}
