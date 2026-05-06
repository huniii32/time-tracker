import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { WorkTabs } from "@/components/layout/WorkTabs";
import { MeetingsList } from "@/components/meetings/MeetingsList";

export default function MeetingsPage() {
  return (
    <AppShell eyebrow="미팅 보드" title="미팅">
      <div className="space-y-4">
        <WorkTabs />
        <div className="flex items-center justify-end">
          <Link
            className="rounded-xl bg-[#0B1F4D] px-4 py-3 text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(11,31,77,0.18)]"
            href="/meetings/new"
          >
            새 미팅
          </Link>
        </div>
        <MeetingsList />
      </div>
    </AppShell>
  );
}
