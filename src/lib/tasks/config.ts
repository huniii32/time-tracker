import type { Priority, TaskStatus } from "@/types";

export const taskStatusOptions: Array<{ value: TaskStatus; label: string }> = [
  { value: "pending", label: "대기" },
  { value: "in_progress", label: "진행 중" },
  { value: "review_requested", label: "검토 요청" },
  { value: "revising", label: "수정 중" },
  { value: "done", label: "완료" },
];

export const priorityOptions: Array<{ value: Priority; label: string }> = [
  { value: "low", label: "낮음" },
  { value: "medium", label: "보통" },
  { value: "high", label: "높음" },
];

export function getTaskStatusLabel(status: TaskStatus) {
  return taskStatusOptions.find((option) => option.value === status)?.label ?? status;
}

export function getPriorityLabel(priority: Priority) {
  return priorityOptions.find((option) => option.value === priority)?.label ?? priority;
}

export function isDueSoon(dueDate: string | null, status: TaskStatus) {
  if (!dueDate || status === "done") {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(`${dueDate}T00:00:00`);
  const diffDays = Math.ceil((due.getTime() - today.getTime()) / 86_400_000);

  return diffDays >= 0 && diffDays <= 3;
}

export function isOverdue(dueDate: string | null, status: TaskStatus) {
  if (!dueDate || status === "done") {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(`${dueDate}T00:00:00`);

  return due.getTime() < today.getTime();
}
