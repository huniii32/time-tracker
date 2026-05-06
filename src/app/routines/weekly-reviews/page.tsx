import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { RoutineTabs } from "@/components/routines/RoutineTabs";
import { WeeklyReviewsList } from "@/components/routines/WeeklyReviewsList";

export default function WeeklyReviewsPage() {
  return (
    <AppShell eyebrow="루틴" title="위클리 피드백">
      <div className="space-y-4">
        <RoutineTabs />
        <div className="flex items-center justify-end">
          <Link
            className="rounded-xl bg-[#0B1F4D] px-4 py-3 text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(11,31,77,0.18)]"
            href="/routines/weekly-reviews/new"
          >
            피드백 작성
          </Link>
        </div>
        <WeeklyReviewsList />
      </div>
    </AppShell>
  );
}
