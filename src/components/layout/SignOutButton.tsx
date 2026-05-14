"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      className="inline-flex h-10 items-center justify-center rounded-full border border-[#e5e7eb] bg-white px-4 text-sm font-semibold text-[#78716c] shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px] transition hover:text-[#0c0a09]"
      onClick={handleSignOut}
      type="button"
    >
      로그아웃
    </button>
  );
}
