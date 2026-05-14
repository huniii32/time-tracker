import type { Priority, TaskStatus } from "@/types";
import { getPriorityLabel, getTaskStatusLabel } from "@/lib/tasks/config";

const statusClasses: Record<TaskStatus, string> = {
  pending: "border-[#e5e7eb] bg-white text-[#78716c]",
  in_progress: "border-[#c1e1f7] bg-[#fafaf9] text-[#0c0a09]",
  review_requested: "border-[#d6d3d1] bg-white text-[#0c0a09]",
  revising: "border-[#d6d3d1] bg-[#fafaf9] text-[#78716c]",
  done: "border-[#c1e1f7] bg-white text-[#0c0a09]",
};

const priorityClasses: Record<Priority, string> = {
  low: "border-[#e5e7eb] bg-white text-[#78716c]",
  medium: "border-[#c1e1f7] bg-white text-[#0c0a09]",
  high: "border-[#d6d3d1] bg-[#fafaf9] text-[#0c0a09]",
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusClasses[status]}`}>
      {getTaskStatusLabel(status)}
    </span>
  );
}

export function TaskPriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${priorityClasses[priority]}`}>
      {getPriorityLabel(priority)}
    </span>
  );
}
