import type { ReactNode } from "react";

type PageHeaderProps = {
  action?: ReactNode;
  description?: string;
  eyebrow?: string;
  title: string;
};

export function PageHeader({ action, description, eyebrow, title }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">{eyebrow}</p> : null}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-normal text-stone-950 sm:text-3xl">{title}</h1>
          {description ? <p className="max-w-2xl text-sm leading-6 text-stone-500">{description}</p> : null}
        </div>
      </div>
      {action ? <div className="flex flex-wrap items-center gap-2 sm:justify-end">{action}</div> : null}
    </header>
  );
}
