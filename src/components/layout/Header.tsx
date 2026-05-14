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
    <header className="sticky top-0 z-10 border-b border-[#e5e7eb] bg-white/90 pt-[env(safe-area-inset-top)] shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px] backdrop-blur">
      <div className="mx-auto flex min-h-[64px] w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link className="flex min-w-0 items-center gap-3" href="/">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3ba6f1] text-base font-semibold text-white shadow-[rgba(0,0,0,0.05)_0px_4px_16px_0px]">
            <Clock3 aria-hidden="true" className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-semibold tracking-normal text-[#0c0a09]">
              Time Tracker
            </span>
            <span className="hidden text-xs font-medium text-[#78716c] sm:block">
              Personal analytics dashboard
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 rounded-full border border-[#e5e7eb] bg-white p-1 shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px] lg:flex">
          {navItems.map((item) => (
            <Link
              className="rounded-full px-3 py-2 text-sm font-medium text-[#78716c] transition-colors hover:bg-[#fafaf9] hover:text-[#0c0a09]"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            className="hidden h-10 items-center justify-center rounded-full border border-[#e5e7eb] bg-white px-4 text-sm font-semibold text-[#78716c] shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px] transition hover:text-[#0c0a09] sm:inline-flex"
            href="/settings"
          >
            설정
          </Link>
          <Link
            className="hidden h-10 items-center justify-center rounded-full border border-[#e5e7eb] bg-white px-4 text-sm font-semibold text-[#78716c] shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px] transition hover:text-[#0c0a09] sm:inline-flex"
            href="/guide"
          >
            가이드
          </Link>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
