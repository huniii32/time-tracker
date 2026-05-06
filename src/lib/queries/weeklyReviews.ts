import type { WeeklyReviewInsert, WeeklyReviewUpdate } from "@/types";
import type { AppSupabaseClient } from "./client";
import { withUpdatedAt } from "./client";

export async function listWeeklyReviews(client: AppSupabaseClient, userId: string) {
  return client
    .from("weekly_reviews")
    .select("*")
    .eq("user_id", userId)
    .order("week_start", { ascending: false });
}

export async function getWeeklyReview(
  client: AppSupabaseClient,
  userId: string,
  weeklyReviewId: string,
) {
  return client
    .from("weekly_reviews")
    .select("*")
    .eq("user_id", userId)
    .eq("id", weeklyReviewId)
    .single();
}

export async function createWeeklyReview(
  client: AppSupabaseClient,
  userId: string,
  payload: Omit<WeeklyReviewInsert, "user_id">,
) {
  return client
    .from("weekly_reviews")
    .insert({ ...payload, user_id: userId })
    .select("*")
    .single();
}

export async function updateWeeklyReview(
  client: AppSupabaseClient,
  userId: string,
  weeklyReviewId: string,
  payload: WeeklyReviewUpdate,
) {
  return client
    .from("weekly_reviews")
    .update(withUpdatedAt(payload))
    .eq("user_id", userId)
    .eq("id", weeklyReviewId)
    .select("*")
    .single();
}

export async function deleteWeeklyReview(
  client: AppSupabaseClient,
  userId: string,
  weeklyReviewId: string,
) {
  return client
    .from("weekly_reviews")
    .delete()
    .eq("user_id", userId)
    .eq("id", weeklyReviewId);
}
