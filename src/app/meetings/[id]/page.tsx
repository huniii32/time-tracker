import { AppShell } from "@/components/layout/AppShell";
import { MeetingDetail } from "@/components/meetings/MeetingDetail";

export default function MeetingDetailPage() {
  return (
    <AppShell eyebrow="미팅 상세" title="미팅">
      <MeetingDetail />
    </AppShell>
  );
}
