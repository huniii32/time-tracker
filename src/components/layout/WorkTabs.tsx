"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/tasks", label: "업무 보드" },
  { href: "/meetings", label: "미팅 보드" },
];

export function WorkTabs() {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-2 rounded-2xl border border-[#E3E8F2] bg-white p-1.5 shadow-[0_10px_24px_rgba(11,31,77,0.05)]">
      {tabs.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);

        return (
          <Link
            className={`flex min-h-11 items-center justify-center rounded-xl px-3 py-2 text-center text-sm font-bold leading-5 ${
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
