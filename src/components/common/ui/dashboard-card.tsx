import type { ReactNode } from "react";

type DashboardCardProps = {
  children: ReactNode;
  className?: string;
};

export function DashboardCard({ children, className = "" }: DashboardCardProps) {
  return (
    <section
      className={`rounded-[10px] border border-gray-200 bg-white shadow-[rgba(0,0,0,0.05)_0px_4px_16px_0px] ${className}`}
    >
      {children}
    </section>
  );
}
