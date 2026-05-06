import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { RoutineTabs } from "@/components/routines/RoutineTabs";
import { TimeLogsList } from "@/components/routines/TimeLogsList";

export default function RoutinesPage() {
  return (
    <AppShell eyebrow="루틴" title="루틴">
      <div className="space-y-4">
        <RoutineTabs />
        <div className="flex items-center justify-end">
          <Link
            className="rounded-xl bg-[#0B1F4D] px-4 py-3 text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(11,31,77,0.18)]"
            href="/routines/time-logs/new"
          >
            시간 기록 추가
          </Link>
        </div>
        <TimeLogsList />
      </div>
    </AppShell>
  );
}
