import type { ReactNode } from "react";

type PillProps = {
  children: ReactNode;
  active?: boolean;
  className?: string;
};

export function Pill({ active = false, children, className = "" }: PillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
        active ? "border-[#3ba6f1] bg-[#c1e1f7] text-stone-950" : "border-stone-300 bg-white text-stone-500"
      } ${className}`}
    >
      {children}
    </span>
  );
}
