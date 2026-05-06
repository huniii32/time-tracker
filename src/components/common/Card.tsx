import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <section
      className={`rounded-2xl border border-[#E3E8F2] bg-white p-4 leading-relaxed shadow-[0_12px_30px_rgba(11,31,77,0.06)] sm:p-5 ${className}`}
    >
      {children}
    </section>
  );
}
