import type { GoalInsert, GoalLevel, GoalType, GoalUpdate } from "@/types";
import type { AppSupabaseClient } from "./client";
import { withUpdatedAt } from "./client";

export async function listGoals(client: AppSupabaseClient, userId: string) {
  return client
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
}

export async function listGoalsByType(
  client: AppSupabaseClient,
  userId: string,
  goalType: GoalType,
) {
  return client.from("goals").select("*").eq("user_id", userId).eq("goal_type", goalType);
}

export async function listGoalsByLevel(
  client: AppSupabaseClient,
  userId: string,
  goalLevel: GoalLevel,
) {
  return client.from("goals").select("*").eq("user_id", userId).eq("goal_level", goalLevel);
}

export async function getGoal(client: AppSupabaseClient, userId: string, goalId: string) {
  return client.from("goals").select("*").eq("user_id", userId).eq("id", goalId).single();
}

export async function createGoal(
  client: AppSupabaseClient,
  userId: string,
  payload: Omit<GoalInsert, "user_id">,
) {
  return client.from("goals").insert({ ...payload, user_id: userId }).select("*").single();
}

export async function updateGoal(
  client: AppSupabaseClient,
  userId: string,
  goalId: string,
  payload: GoalUpdate,
) {
  return client
    .from("goals")
    .update(withUpdatedAt(payload))
    .eq("user_id", userId)
    .eq("id", goalId)
    .select("*")
    .single();
}

export async function deleteGoal(client: AppSupabaseClient, userId: string, goalId: string) {
  return client.from("goals").delete().eq("user_id", userId).eq("id", goalId);
}
