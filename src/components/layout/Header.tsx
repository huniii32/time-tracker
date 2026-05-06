import type { SVGProps } from "react";
import Link from "next/link";
import { SignOutButton } from "./SignOutButton";

const navItems = [
  { href: "/", label: "대시보드" },
  { href: "/notes", label: "노트" },
  { href: "/tasks", label: "업무" },
  { href: "/routines", label: "루틴" },
  { href: "/reflections", label: "회고" },
];

function Clock3(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6h4" />
    </svg>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-[#E3E8F2] bg-white/90 pt-[env(safe-area-inset-top)] shadow-[0_8px_24px_rgba(11,31,77,0.04)] backdrop-blur">
      <div className="mx-auto flex min-h-[64px] w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link className="flex min-w-0 items-center gap-3" href="/">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0B1F4D] text-base font-black text-white shadow-[0_10px_22px_rgba(11,31,77,0.22)]">
            <Clock3 aria-hidden="true" className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-extrabold tracking-tight text-[#0B1F4D]">
              Time Tracker
            </span>
            <span className="hidden text-xs font-medium text-[#667085] sm:block">
              Developer productivity app
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 rounded-2xl border border-[#E3E8F2] bg-[#F5F7FB] p-1 lg:flex">
          {navItems.map((item) => (
            <Link
              className="rounded-xl px-3 py-2 text-sm font-bold text-[#667085] transition-colors hover:bg-white hover:text-[#0B1F4D]"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            className="inline-flex h-10 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            href="/settings"
          >
            설정
          </Link>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            href="/guide"
          >
            설명서
          </Link>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
