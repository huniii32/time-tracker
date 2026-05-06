import type { SupabaseClient } from "@supabase/supabase-js";
import type { AppDatabase } from "@/types";

export type AppSupabaseClient = SupabaseClient<AppDatabase, "public">;

export function withUpdatedAt<T extends object>(payload: T) {
  return {
    ...payload,
    updated_at: new Date().toISOString(),
  };
}
