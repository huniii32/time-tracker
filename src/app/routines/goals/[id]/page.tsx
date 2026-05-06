import { AppShell } from "@/components/layout/AppShell";
import { GoalDetail } from "@/components/routines/GoalDetail";

export default function GoalDetailPage() {
  return (
    <AppShell eyebrow="목표 통합" title="목표 상세">
      <GoalDetail />
    </AppShell>
  );
}
