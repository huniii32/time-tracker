import { AppShell } from "@/components/layout/AppShell";
import { EditGoalLoader } from "@/components/routines/EditGoalLoader";

export default function EditGoalPage() {
  return (
    <AppShell eyebrow="목표 통합" title="목표 수정">
      <EditGoalLoader />
    </AppShell>
  );
}
