import type { Routine, RoutineUpdate } from "@/types";
import type { AppSupabaseClient } from "@/lib/queries/client";
import { withUpdatedAt } from "@/lib/queries/client";

export type RoutineFormPayload = {
  title: string;
  description?: string | null;
  category?: string | null;
};

export async function getUserRoutines(client: AppSupabaseClient, userId: string) {
  return client
    .from("routines")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
}

export async function createRoutine(
  client: AppSupabaseClient,
  userId: string,
  payload: RoutineFormPayload,
) {
  return client
    .from("routines")
    .insert({
      user_id: userId,
      title: normalizeRequiredText(payload.title),
      description: normalizeOptionalText(payload.description),
      category: normalizeOptionalText(payload.category),
    })
    .select("*")
    .single();
}

export async function updateRoutine(
  client: AppSupabaseClient,
  userId: string,
  routineId: string,
  payload: RoutineFormPayload,
) {
  const updatePayload: RoutineUpdate = {
    title: normalizeRequiredText(payload.title),
    description: normalizeOptionalText(payload.description),
    category: normalizeOptionalText(payload.category),
  };

  return client
    .from("routines")
    .update(withUpdatedAt(updatePayload))
    .eq("user_id", userId)
    .eq("id", routineId)
    .select("*")
    .single();
}

export async function archiveRoutine(client: AppSupabaseClient, userId: string, routineId: string) {
  return client
    .from("routines")
    .update(withUpdatedAt({ is_active: false }))
    .eq("user_id", userId)
    .eq("id", routineId);
}

export function buildRoutineFormValues(routine?: Routine): RoutineFormPayload {
  return {
    title: routine?.title ?? "",
    description: routine?.description ?? "",
    category: routine?.category ?? "",
  };
}

function normalizeRequiredText(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error("루틴명을 입력해 주세요.");
  }

  return trimmed;
}

function normalizeOptionalText(value?: string | null) {
  const trimmed = value?.trim();

  return trimmed || null;
}
