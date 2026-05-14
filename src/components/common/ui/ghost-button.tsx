import type { ReactNode } from "react";

type GhostButtonProps = {
  children: ReactNode;
  className?: string;
};

export function GhostButton({ children, className = "" }: GhostButtonProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-[#3ba6f1] hover:text-[#3ba6f1] ${className}`}
    >
      {children}
    </span>
  );
}
