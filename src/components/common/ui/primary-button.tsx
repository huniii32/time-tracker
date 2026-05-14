import type { ReactNode } from "react";

type PrimaryButtonProps = {
  children: ReactNode;
  className?: string;
};

export function PrimaryButton({ children, className = "" }: PrimaryButtonProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-[#3ba6f1] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2d94dd] ${className}`}
    >
      {children}
    </span>
  );
}
