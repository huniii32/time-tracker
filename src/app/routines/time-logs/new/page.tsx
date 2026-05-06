import { AppShell } from "@/components/layout/AppShell";
import { TimeLogForm } from "@/components/routines/TimeLogForm";

export default function NewTimeLogPage() {
  return (
    <AppShell eyebrow="데일리 시간 기록" title="새 시간 기록">
      <TimeLogForm mode="create" />
    </AppShell>
  );
}
