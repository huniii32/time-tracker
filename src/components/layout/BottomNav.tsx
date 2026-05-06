"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/notes", label: "노트" },
  { href: "/tasks", label: "업무" },
  { href: "/routines", label: "루틴" },
  { href: "/reflections", label: "회고" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-[#E3E8F2] bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_rgba(11,31,77,0.08)] backdrop-blur lg:hidden">
      <div className="mx-auto grid min-h-[72px] max-w-3xl grid-cols-5 gap-1 px-2 py-2">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : item.href === "/tasks"
                ? pathname.startsWith("/tasks") || pathname.startsWith("/meetings")
                : pathname.startsWith(item.href);

          return (
            <Link
              className={`flex min-h-12 items-center justify-center rounded-xl px-1 text-sm font-bold leading-none transition-colors ${
                active
                  ? "bg-[#0B1F4D] text-white shadow-[0_8px_18px_rgba(11,31,77,0.18)]"
                  : "text-[#667085]"
              }`}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
