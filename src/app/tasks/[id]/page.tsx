import { AppShell } from "@/components/layout/AppShell";
import { TaskDetail } from "@/components/tasks/TaskDetail";

export default function TaskDetailPage() {
  return (
    <AppShell eyebrow="업무 상세" title="업무">
      <TaskDetail />
    </AppShell>
  );
}
