import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { WorkTabs } from "@/components/layout/WorkTabs";
import { TasksList } from "@/components/tasks/TasksList";

export default function TasksPage() {
  return (
    <AppShell eyebrow="업무 보드" title="업무">
      <div className="space-y-4">
        <WorkTabs />
        <div className="flex items-center justify-end">
          <Link
            className="rounded-xl bg-[#0B1F4D] px-4 py-3 text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(11,31,77,0.18)]"
            href="/tasks/new"
          >
            새 업무
          </Link>
        </div>
        <TasksList />
      </div>
    </AppShell>
  );
}
