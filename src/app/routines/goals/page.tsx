import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { GoalsList } from "@/components/routines/GoalsList";
import { RoutineTabs } from "@/components/routines/RoutineTabs";

export default function RoutineGoalsPage() {
  return (
    <AppShell eyebrow="루틴" title="목표 통합">
      <div className="space-y-4">
        <RoutineTabs />
        <div className="flex items-center justify-end">
          <Link
            className="rounded-xl bg-[#0B1F4D] px-4 py-3 text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(11,31,77,0.18)]"
            href="/routines/goals/new"
          >
            목표 작성
          </Link>
        </div>
        <GoalsList />
      </div>
    </AppShell>
  );
}
