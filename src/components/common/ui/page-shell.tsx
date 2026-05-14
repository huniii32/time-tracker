import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <div className={`mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
