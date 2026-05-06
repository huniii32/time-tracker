import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { Header } from "./Header";

type AppShellProps = {
  children: ReactNode;
  title: string;
  eyebrow?: string;
};

export function AppShell({ children, eyebrow, title }: AppShellProps) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 pb-[calc(7.5rem+env(safe-area-inset-bottom))] pt-5 sm:px-6 lg:px-8">
        <div className="mb-5 rounded-3xl border border-[#E3E8F2] bg-white/80 p-5 shadow-[0_16px_40px_rgba(11,31,77,0.06)] backdrop-blur sm:p-6">
          {eyebrow ? (
            <p className="text-sm font-bold leading-5 text-[#C92735]">{eyebrow}</p>
          ) : null}
          <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="text-[1.8rem] font-extrabold leading-tight tracking-tight text-[#0B1F4D] sm:text-4xl">
              {title}
            </h1>
            <p className="max-w-md text-sm leading-6 text-[#667085]">
              기록이 시간을 만들고, 시간이 성장을 만듭니다.
            </p>
          </div>
        </div>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
