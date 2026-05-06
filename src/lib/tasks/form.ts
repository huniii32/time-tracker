import type { Priority, Task, TaskInsert, TaskStatus, TaskUpdate } from "@/types";

export type TaskFormValues = {
  title: string;
  requester: string;
  due_date: string;
  priority: Priority;
  status: TaskStatus;
  goal: string;
  output: string;
  feedback: string;
  satisfaction: string;
  tags: string;
};

export function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function stringifyTags(tags: string[]) {
  return tags.join(", ");
}

export function getInitialTaskFormValues(task?: Task): TaskFormValues {
  return {
    title: task?.title ?? "",
    requester: task?.requester ?? "",
    due_date: task?.due_date ?? "",
    priority: task?.priority ?? "medium",
    status: task?.status ?? "pending",
    goal: task?.goal ?? "",
    output: task?.output ?? "",
    feedback: task?.feedback ?? "",
    satisfaction: task?.satisfaction ? String(task.satisfaction) : "",
    tags: task ? stringifyTags(task.tags) : "",
  };
}

function normalizeSatisfaction(value: string) {
  if (!value) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return Math.min(5, Math.max(1, parsed));
}

export function buildTaskInsert(values: TaskFormValues): Omit<TaskInsert, "user_id"> {
  return {
    title: values.title.trim(),
    requester: values.requester.trim() || null,
    due_date: values.due_date || null,
    priority: values.priority,
    status: values.status,
    goal: values.goal.trim() || null,
    output: values.output.trim() || null,
    feedback: values.feedback.trim() || null,
    satisfaction: normalizeSatisfaction(values.satisfaction),
    tags: parseTags(values.tags),
  };
}

export function buildTaskUpdate(values: TaskFormValues): TaskUpdate {
  return buildTaskInsert(values);
}
