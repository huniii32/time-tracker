import { AppShell } from "@/components/layout/AppShell";
import { EditTaskLoader } from "@/components/tasks/EditTaskLoader";

export default function EditTaskPage() {
  return (
    <AppShell eyebrow="업무 수정" title="업무">
      <EditTaskLoader />
    </AppShell>
  );
}
