import { AppShell } from "@/components/layout/AppShell";
import { TaskForm } from "@/components/tasks/TaskForm";

export default function NewTaskPage() {
  return (
    <AppShell eyebrow="업무 작성" title="새 업무">
      <TaskForm mode="create" />
    </AppShell>
  );
}
