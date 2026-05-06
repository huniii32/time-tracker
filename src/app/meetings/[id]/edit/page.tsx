import { AppShell } from "@/components/layout/AppShell";
import { EditMeetingLoader } from "@/components/meetings/EditMeetingLoader";

export default function EditMeetingPage() {
  return (
    <AppShell eyebrow="미팅 수정" title="미팅">
      <EditMeetingLoader />
    </AppShell>
  );
}
