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
    <div className="grid grid-cols-2 rounded-full border border-[#e5e7eb] bg-white p-1 shadow-[rgba(0,0,0,0.05)_0px_4px_16px_0px]">
      {tabs.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);

        return (
          <Link
            className={`flex min-h-10 items-center justify-center rounded-full px-3 py-2 text-center text-sm font-semibold leading-5 ${
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
