"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const email = String(formData.get("email"));
      const password = String(formData.get("password"));
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.replace("/");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-4 py-[calc(2rem+env(safe-area-inset-top))]">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center gap-6 lg:grid-cols-[1fr_420px]">
        <div className="hidden rounded-[2rem] border border-[#E3E8F2] bg-white p-8 shadow-[0_24px_70px_rgba(11,31,77,0.10)] lg:block">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B1F4D] text-lg font-black text-white">
              TT
            </span>
            <div>
              <p className="text-xl font-extrabold text-[#0B1F4D]">Time Tracker</p>
              <p className="text-sm text-[#667085]">Developer productivity app</p>
            </div>
          </div>
          <h1 className="mt-10 text-4xl font-extrabold leading-tight tracking-tight text-[#0B1F4D]">
            하루를 기록하고
            <br />
            시간을 성장으로 바꾸세요.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-[#667085]">
            업무, 노트, 미팅, 루틴, 목표와 회고를 하나의 흐름으로 관리하는 개발자 전용 생산성 앱입니다.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              ["기록", "업무와 시간을 남기기"],
              ["관리", "루틴과 목표 정리"],
              ["성장", "회고로 개선하기"],
            ].map(([title, text]) => (
              <div className="rounded-2xl bg-[#F5F7FB] p-4" key={title}>
                <p className="font-bold text-[#0B1F4D]">{title}</p>
                <p className="mt-1 text-xs leading-5 text-[#667085]">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm rounded-[1.5rem] border border-[#E3E8F2] bg-white p-5 shadow-[0_24px_70px_rgba(11,31,77,0.10)] sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0B1F4D] text-base font-black text-white">
              TT
            </span>
            <div>
              <p className="text-sm font-bold text-[#C92735]">Time Tracker</p>
              <p className="text-xs text-[#667085]">개발자 업무 시간 기록 앱</p>
            </div>
          </div>
          <h1 className="mt-7 text-3xl font-extrabold leading-tight text-[#0B1F4D]">로그인</h1>
          <p className="mt-2 text-sm leading-6 text-[#667085]">
            오늘의 업무와 성장 기록을 이어가세요.
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
                name="password"
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
              {loading ? "로그인 중" : "로그인"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#667085]">
            계정이 없나요?{" "}
            <Link className="inline-flex min-h-11 items-center font-bold text-[#0B1F4D]" href="/signup">
              회원가입
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
