import { AppShell } from "@/components/layout/AppShell";
import { WeeklyReviewDetail } from "@/components/routines/WeeklyReviewDetail";

export default function WeeklyReviewDetailPage() {
  return (
    <AppShell eyebrow="위클리 피드백" title="피드백">
      <WeeklyReviewDetail />
    </AppShell>
  );
}
