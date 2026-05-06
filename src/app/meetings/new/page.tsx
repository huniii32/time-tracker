import { AppShell } from "@/components/layout/AppShell";
import { MeetingForm } from "@/components/meetings/MeetingForm";

export default function NewMeetingPage() {
  return (
    <AppShell eyebrow="미팅 작성" title="새 미팅">
      <MeetingForm mode="create" />
    </AppShell>
  );
}
