"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DashboardCard, EmptyState, MetricCard, Pill } from "@/components/common/ui";
import { listTasks, updateTask } from "@/lib/queries/tasks";
import { createClient } from "@/lib/supabase/browser";
import { getTaskStatusLabel, isDueSoon, isOverdue, taskStatusOptions } from "@/lib/tasks/config";
import type { Task, TaskStatus } from "@/types";
import { TaskPriorityBadge, TaskStatusBadge } from "./TaskBadges";

export function TasksList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadTasks() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Login is required.");
        setLoading(false);
        return;
      }

      const { data, error: listError } = await listTasks(supabase, user.id);

      if (listError) {
        setError(listError.message);
      } else {
        setTasks(data ?? []);
      }

      setLoading(false);
    }

    void loadTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    if (statusFilter === "all") {
      return tasks;
    }

    return tasks.filter((task) => task.status === statusFilter);
  }, [statusFilter, tasks]);

  const activeCount = tasks.filter((task) => task.status !== "done").length;
  const doneCount = tasks.filter((task) => task.status === "done").length;
  const dueSoonCount = tasks.filter((task) => isDueSoon(task.due_date, task.status) || isOverdue(task.due_date, task.status)).length;

  async function handleStatusChange(task: Task, status: TaskStatus) {
    setError("");
    setUpdatingId(task.id);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Login is required.");
      setUpdatingId(null);
      return;
    }

    const { data, error: updateError } = await updateTask(supabase, user.id, task.id, { status });

    if (updateError) {
      setError(updateError.message);
    } else if (data) {
      setTasks((current) => current.map((item) => (item.id === data.id ? data : item)));
    }

    setUpdatingId(null);
  }

  if (loading) {
    return <DashboardCard>Loading tasks...</DashboardCard>;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Active" value={`${activeCount}`} />
        <MetricCard label="Done" value={`${doneCount}`} />
        <MetricCard label="Needs attention" value={`${dueSoonCount}`} />
      </div>

      <DashboardCard className="p-4 sm:p-4">
        <label className="block text-sm font-medium text-[#78716c]">
          Status filter
          <select
            className="mt-2 w-full rounded-[10px] border border-[#d6d3d1] bg-white px-3 py-2.5 text-sm text-[#0c0a09] focus:border-[#3ba6f1] focus:outline-none focus:ring-2 focus:ring-[#c1e1f7]"
            onChange={(event) => setStatusFilter(event.target.value as TaskStatus | "all")}
            value={statusFilter}
          >
            <option value="all">All tasks</option>
            {taskStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </DashboardCard>

      {error ? <p className="text-sm text-[#78716c]">{error}</p> : null}

      {filteredTasks.length === 0 ? (
        <DashboardCard>
          <EmptyState description="Create a task with status, due date, and priority." title="No tasks yet." />
        </DashboardCard>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const dueSoon = isDueSoon(task.due_date, task.status);
            const overdue = isOverdue(task.due_date, task.status);

            return (
              <DashboardCard className={dueSoon || overdue ? "border-[#d6d3d1]" : ""} key={task.id}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <TaskStatusBadge status={task.status} />
                      <TaskPriorityBadge priority={task.priority} />
                      {overdue ? <Pill>Overdue</Pill> : null}
                      {dueSoon ? <Pill>Due soon</Pill> : null}
                    </div>
                    <Link href={`/tasks/${task.id}`}>
                      <h2 className="mt-3 text-lg font-semibold text-[#0c0a09]">{task.title}</h2>
                    </Link>
                    <p className="mt-1 text-sm text-[#78716c]">
                      Due: {task.due_date ?? "-"} · Requester: {task.requester ?? "-"}
                    </p>
                  </div>
                  <select
                    aria-label={`${task.title} status`}
                    className="w-full shrink-0 rounded-[10px] border border-[#d6d3d1] bg-white px-3 py-2 text-sm text-[#0c0a09] sm:w-auto"
                    disabled={updatingId === task.id}
                    onChange={(event) => void handleStatusChange(task, event.target.value as TaskStatus)}
                    value={task.status}
                  >
                    {taskStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                {task.goal ? <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#78716c]">{task.goal}</p> : null}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {task.satisfaction ? <Pill>Satisfaction {task.satisfaction}/5</Pill> : null}
                  {task.tags.map((tag) => (
                    <Pill key={tag}>#{tag}</Pill>
                  ))}
                </div>
                <p className="mt-3 text-xs text-[#78716c]">Status: {getTaskStatusLabel(task.status)}</p>
              </DashboardCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
