import { AppShell } from "@/components/layout/AppShell";
import { TimeLogDetail } from "@/components/routines/TimeLogDetail";

export default function TimeLogDetailPage() {
  return (
    <AppShell eyebrow="데일리 시간 기록" title="시간 기록">
      <TimeLogDetail />
    </AppShell>
  );
}
