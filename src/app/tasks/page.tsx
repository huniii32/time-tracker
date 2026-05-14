import Link from "next/link";
import { PrimaryButton } from "@/components/common/ui";
import { AppShell } from "@/components/layout/AppShell";
import { WorkTabs } from "@/components/layout/WorkTabs";
import { TasksList } from "@/components/tasks/TasksList";

export default function TasksPage() {
  return (
    <AppShell eyebrow="업무 보드" title="업무">
      <div className="space-y-4">
        <WorkTabs />
        <div className="flex items-center justify-end">
          <Link href="/tasks/new">
            <PrimaryButton>새 업무</PrimaryButton>
          </Link>
        </div>
        <TasksList />
      </div>
    </AppShell>
  );
}
