import { AppShell } from "@/components/layout/AppShell";
import { GoalForm } from "@/components/routines/GoalForm";

export default function NewGoalPage() {
  return (
    <AppShell eyebrow="목표 통합" title="새 목표">
      <GoalForm mode="create" />
    </AppShell>
  );
}
