import type { ReactNode } from "react";
import { DashboardCard } from "./dashboard-card";

type MetricCardProps = {
  label: string;
  value: ReactNode;
  detail?: string;
  helper?: string;
};

export function MetricCard({ detail, helper, label, value }: MetricCardProps) {
  const supportingText = helper ?? detail;

  return (
    <DashboardCard className="p-4">
      <div className="space-y-2">
        <p className="text-xs font-medium text-stone-500">{label}</p>
        <div className="text-2xl font-semibold text-stone-950">{value}</div>
        {supportingText ? <p className="text-xs leading-5 text-stone-500">{supportingText}</p> : null}
      </div>
    </DashboardCard>
  );
}
