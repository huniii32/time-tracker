import type { RoutineCompletion } from "@/types";
import type { AppSupabaseClient } from "@/lib/queries/client";

export async function getRoutineCompletionsForRange(
  client: AppSupabaseClient,
  userId: string,
  startDate: string,
  endDate: string,
) {
  return client
    .from("routine_completions")
    .select("*")
    .eq("user_id", userId)
    .gte("completion_date", startDate)
    .lte("completion_date", endDate);
}

export async function setRoutineCompletion(params: {
  client: AppSupabaseClient;
  userId: string;
  routineId: string;
  completionDate: string;
  completed: boolean;
}) {
  const { client, userId, routineId, completionDate, completed } = params;

  if (!completed) {
    return client
      .from("routine_completions")
      .delete()
      .eq("user_id", userId)
      .eq("routine_id", routineId)
      .eq("completion_date", completionDate);
  }

  return client
    .from("routine_completions")
    .upsert(
      {
        user_id: userId,
        routine_id: routineId,
        completion_date: completionDate,
      },
      { onConflict: "user_id,routine_id,completion_date" },
    )
    .select("*")
    .single();
}

export function buildRoutineCompletionMap(completions: RoutineCompletion[]) {
  return completions.reduce<Record<string, boolean>>((result, completion) => {
    result[getRoutineCompletionKey(completion.routine_id, completion.completion_date)] = true;

    return result;
  }, {});
}

export function getRoutineCompletionKey(routineId: string, dateKey: string) {
  return `${routineId}:${dateKey}`;
}
