"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const passwordConfirm = String(formData.get("passwordConfirm"));

    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      router.replace("/");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-4 py-[calc(2rem+env(safe-area-inset-top))]">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center">
        <div className="w-full rounded-[1.5rem] border border-[#E3E8F2] bg-white p-5 shadow-[0_24px_70px_rgba(11,31,77,0.10)] sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0B1F4D] text-base font-black text-white">
              TT
            </span>
            <div>
              <p className="text-sm font-bold text-[#C92735]">Time Tracker</p>
              <p className="text-xs text-[#667085]">개발자 성장 관리 플랫폼</p>
            </div>
          </div>
          <h1 className="mt-7 text-3xl font-extrabold leading-tight text-[#0B1F4D]">회원가입</h1>
          <p className="mt-2 text-sm leading-6 text-[#667085]">
            업무 시간과 회고를 체계적으로 기록할 개인 공간을 만듭니다.
          </p>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm font-bold text-[#0B1F4D]">
              이메일
              <input
                className="mt-2 w-full rounded-xl border border-[#E3E8F2] bg-[#FBFCFF] px-3 py-3 text-base outline-none transition-colors focus:border-[#0B1F4D] focus:bg-white"
                name="email"
                required
                type="email"
              />
            </label>
            <label className="block text-sm font-bold text-[#0B1F4D]">
              비밀번호
              <input
                className="mt-2 w-full rounded-xl border border-[#E3E8F2] bg-[#FBFCFF] px-3 py-3 text-base outline-none transition-colors focus:border-[#0B1F4D] focus:bg-white"
                minLength={6}
                name="password"
                required
                type="password"
              />
            </label>
            <label className="block text-sm font-bold text-[#0B1F4D]">
              비밀번호 확인
              <input
                className="mt-2 w-full rounded-xl border border-[#E3E8F2] bg-[#FBFCFF] px-3 py-3 text-base outline-none transition-colors focus:border-[#0B1F4D] focus:bg-white"
                minLength={6}
                name="passwordConfirm"
                required
                type="password"
              />
            </label>
            {error ? <p className="rounded-xl bg-[#FEF2F2] p-3 text-sm leading-6 text-[#C92735]">{error}</p> : null}
            <button
              className="w-full rounded-xl bg-[#0B1F4D] px-4 py-3 text-base font-extrabold text-white shadow-[0_12px_24px_rgba(11,31,77,0.20)] disabled:opacity-60"
              disabled={loading}
              type="submit"
            >
              {loading ? "가입 중" : "회원가입"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#667085]">
            이미 계정이 있나요?{" "}
            <Link className="inline-flex min-h-11 items-center font-bold text-[#0B1F4D]" href="/login">
              로그인
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
