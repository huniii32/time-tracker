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
      className="shrink-0 rounded-xl border border-[#E3E8F2] bg-white px-3 py-2 text-sm font-bold text-[#0B1F4D] shadow-sm transition-colors hover:bg-[#F5F7FB]"
      onClick={handleSignOut}
      type="button"
    >
      로그아웃
    </button>
  );
}
