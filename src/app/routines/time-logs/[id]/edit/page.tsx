import { AppShell } from "@/components/layout/AppShell";
import { EditTimeLogLoader } from "@/components/routines/EditTimeLogLoader";

export default function EditTimeLogPage() {
  return (
    <AppShell eyebrow="데일리 시간 기록 수정" title="시간 기록">
      <EditTimeLogLoader />
    </AppShell>
  );
}
