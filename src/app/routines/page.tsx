import Link from "next/link";
import { PrimaryButton } from "@/components/common/ui";
import { AppShell } from "@/components/layout/AppShell";
import { RoutineTabs } from "@/components/routines/RoutineTabs";
import { TimeLogsList } from "@/components/routines/TimeLogsList";

export default function RoutinesPage() {
  return (
    <AppShell eyebrow="루틴" title="루틴">
      <div className="space-y-4">
        <RoutineTabs />
        <div className="flex items-center justify-end">
          <Link href="/routines/time-logs/new">
            <PrimaryButton>시간 기록 추가</PrimaryButton>
          </Link>
        </div>
        <TimeLogsList />
      </div>
    </AppShell>
  );
}
