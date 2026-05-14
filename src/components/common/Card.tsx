import type { ReactNode } from "react";
import { DashboardCard } from "./ui";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return <DashboardCard className={className}>{children}</DashboardCard>;
}
