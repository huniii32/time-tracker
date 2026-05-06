"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/routines", label: "데일리 시간" },
  { href: "/routines/weekly-reviews", label: "위클리 피드백" },
  { href: "/routines/goals", label: "목표 통합" },
];

export function RoutineTabs() {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-3 rounded-2xl border border-[#E3E8F2] bg-white p-1.5 shadow-[0_10px_24px_rgba(11,31,77,0.05)]">
      {tabs.map((tab) => {
        const active =
          tab.href === "/routines"
            ? pathname === "/routines" || pathname.startsWith("/routines/time-logs")
            : pathname === tab.href || pathname.startsWith(`${tab.href}/`);

        return (
          <Link
            className={`flex min-h-11 items-center justify-center rounded-xl px-2 py-2 text-center text-[13px] font-bold leading-4 sm:text-sm ${
              active ? "bg-[#0B1F4D] text-white shadow-sm" : "text-[#667085]"
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
