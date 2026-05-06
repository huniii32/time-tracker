import type { Priority, TaskInsert, TaskStatus, TaskUpdate } from "@/types";
import type { AppSupabaseClient } from "./client";
import { withUpdatedAt } from "./client";

export async function listTasks(client: AppSupabaseClient, userId: string) {
  return client
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("due_date", { ascending: true })
    .order("created_at", { ascending: false });
}

export async function listTasksByStatus(
  client: AppSupabaseClient,
  userId: string,
  status: TaskStatus,
) {
  return client.from("tasks").select("*").eq("user_id", userId).eq("status", status);
}

export async function listTasksByPriority(
  client: AppSupabaseClient,
  userId: string,
  priority: Priority,
) {
  return client.from("tasks").select("*").eq("user_id", userId).eq("priority", priority);
}

export async function getTask(client: AppSupabaseClient, userId: string, taskId: string) {
  return client.from("tasks").select("*").eq("user_id", userId).eq("id", taskId).single();
}

export async function createTask(
  client: AppSupabaseClient,
  userId: string,
  payload: Omit<TaskInsert, "user_id">,
) {
  return client.from("tasks").insert({ ...payload, user_id: userId }).select("*").single();
}

export async function updateTask(
  client: AppSupabaseClient,
  userId: string,
  taskId: string,
  payload: TaskUpdate,
) {
  return client
    .from("tasks")
    .update(withUpdatedAt(payload))
    .eq("user_id", userId)
    .eq("id", taskId)
    .select("*")
    .single();
}

export async function deleteTask(client: AppSupabaseClient, userId: string, taskId: string) {
  return client.from("tasks").delete().eq("user_id", userId).eq("id", taskId);
}
