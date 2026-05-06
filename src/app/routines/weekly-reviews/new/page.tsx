import { AppShell } from "@/components/layout/AppShell";
import { WeeklyReviewForm } from "@/components/routines/WeeklyReviewForm";

export default function NewWeeklyReviewPage() {
  return (
    <AppShell eyebrow="위클리 피드백" title="새 피드백">
      <WeeklyReviewForm mode="create" />
    </AppShell>
  );
}
