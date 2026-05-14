"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/routines", label: "데일리 시간" },
  { href: "/routines/weekly-reviews", label: "주간 회고" },
  { href: "/routines/goals", label: "목표 통합" },
];

export function RoutineTabs() {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-3 rounded-full border border-[#e5e7eb] bg-white p-1 shadow-[rgba(0,0,0,0.05)_0px_4px_16px_0px]">
      {tabs.map((tab) => {
        const active =
          tab.href === "/routines"
            ? pathname === "/routines" || pathname.startsWith("/routines/time-logs")
            : pathname === tab.href || pathname.startsWith(`${tab.href}/`);

        return (
          <Link
            className={`flex min-h-10 items-center justify-center rounded-full px-2 py-2 text-center text-[13px] font-semibold leading-4 sm:text-sm ${
              active ? "bg-[#3ba6f1] text-white shadow-sm" : "text-[#78716c]"
            }`}
            href={tab.href}
            key={tab.href}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
