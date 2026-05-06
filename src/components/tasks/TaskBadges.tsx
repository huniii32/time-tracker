import type { Priority, TaskStatus } from "@/types";
import { getPriorityLabel, getTaskStatusLabel } from "@/lib/tasks/config";

const statusClasses: Record<TaskStatus, string> = {
  pending: "bg-[#F7F8FA] text-[#374151]",
  in_progress: "bg-[#EAF1FF] text-[#1F2F5C]",
  review_requested: "bg-[#FFF7ED] text-[#9A3412]",
  revising: "bg-[#FEF2F2] text-[#C92735]",
  done: "bg-[#ECFDF3] text-[#067647]",
};

const priorityClasses: Record<Priority, string> = {
  low: "bg-[#F7F8FA] text-[#6B7280]",
  medium: "bg-[#EAF1FF] text-[#1F2F5C]",
  high: "bg-[#FEF2F2] text-[#C92735]",
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`rounded px-2 py-1 text-xs font-semibold ${statusClasses[status]}`}>
      {getTaskStatusLabel(status)}
    </span>
  );
}

export function TaskPriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`rounded px-2 py-1 text-xs font-semibold ${priorityClasses[priority]}`}>
      {getPriorityLabel(priority)}
    </span>
  );
}
