import Link from "next/link";
import { PrimaryButton } from "@/components/common/ui";
import { AppShell } from "@/components/layout/AppShell";
import { WorkTabs } from "@/components/layout/WorkTabs";
import { MeetingsList } from "@/components/meetings/MeetingsList";

export default function MeetingsPage() {
  return (
    <AppShell eyebrow="미팅 보드" title="미팅">
      <div className="space-y-4">
        <WorkTabs />
        <div className="flex items-center justify-end">
          <Link href="/meetings/new">
            <PrimaryButton>새 미팅</PrimaryButton>
          </Link>
        </div>
        <MeetingsList />
      </div>
    </AppShell>
  );
}
