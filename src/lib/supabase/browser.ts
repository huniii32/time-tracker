import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { AppDatabase } from "@/types";

type TypedSupabaseClient = SupabaseClient<AppDatabase, "public">;

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createBrowserClient<AppDatabase, "public">(
    url,
    anonKey,
  ) as unknown as TypedSupabaseClient;
}
