import type { ReactNode } from "react";

type EmptyStateProps = {
  action?: ReactNode;
  description?: string;
  title: string;
};

export function EmptyState({ action, description, title }: EmptyStateProps) {
  return (
    <div className="rounded-[16px] border border-dashed border-stone-300 bg-white px-6 py-10 text-center">
      <p className="text-sm font-semibold text-stone-950">{title}</p>
      {description ? <p className="mt-2 text-sm leading-6 text-stone-500">{description}</p> : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}
