import { AppShell } from "@/components/layout/AppShell";
import { EditWeeklyReviewLoader } from "@/components/routines/EditWeeklyReviewLoader";

export default function EditWeeklyReviewPage() {
  return (
    <AppShell eyebrow="위클리 피드백 수정" title="피드백">
      <EditWeeklyReviewLoader />
    </AppShell>
  );
}
