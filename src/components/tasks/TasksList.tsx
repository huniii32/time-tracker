"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/common/Card";
import { listTasks, updateTask } from "@/lib/queries/tasks";
import {
  getTaskStatusLabel,
  isDueSoon,
  isOverdue,
  taskStatusOptions,
} from "@/lib/tasks/config";
import { createClient } from "@/lib/supabase/browser";
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
        setError("로그인이 필요합니다.");
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

  async function handleStatusChange(task: Task, status: TaskStatus) {
    setError("");
    setUpdatingId(task.id);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("로그인이 필요합니다.");
      setUpdatingId(null);
      return;
    }

    const { data, error: updateError } = await updateTask(supabase, user.id, task.id, {
      status,
    });

    if (updateError) {
      setError(updateError.message);
    } else if (data) {
      setTasks((current) => current.map((item) => (item.id === data.id ? data : item)));
    }

    setUpdatingId(null);
  }

  if (loading) {
    return <Card>업무를 불러오는 중입니다.</Card>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm">
        <label className="block text-sm font-semibold text-[#1F2F5C]">
          상태 필터
          <select
            className="mt-1 w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-3 text-base"
            onChange={(event) => setStatusFilter(event.target.value as TaskStatus | "all")}
            value={statusFilter}
          >
            <option value="all">전체 업무</option>
            {taskStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? <p className="text-sm text-[#C92735]">{error}</p> : null}

      {filteredTasks.length === 0 ? (
        <Card>
          <h2 className="font-semibold text-[#1F2F5C]">아직 업무가 없습니다.</h2>
          <p className="mt-2 text-sm text-[#6B7280]">
            맡은 업무의 목표, 마감기한, 상태를 먼저 기록해보세요.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const dueSoon = isDueSoon(task.due_date, task.status);
            const overdue = isOverdue(task.due_date, task.status);

            return (
              <Card className={dueSoon || overdue ? "border-[#C92735]" : ""} key={task.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <TaskStatusBadge status={task.status} />
                      <TaskPriorityBadge priority={task.priority} />
                      {overdue ? (
                        <span className="rounded bg-[#FEF2F2] px-2 py-1 text-xs font-semibold text-[#C92735]">
                          마감 지남
                        </span>
                      ) : null}
                      {dueSoon ? (
                        <span className="rounded bg-[#FEF2F2] px-2 py-1 text-xs font-semibold text-[#C92735]">
                          마감 임박
                        </span>
                      ) : null}
                    </div>
                    <Link href={`/tasks/${task.id}`}>
                      <h2 className="mt-2 text-lg font-bold text-[#1F2F5C]">{task.title}</h2>
                    </Link>
                    <p className="mt-1 text-sm text-[#6B7280]">
                      마감: {task.due_date ?? "-"} · 요청자: {task.requester ?? "-"}
                    </p>
                  </div>
                  <select
                    aria-label={`${task.title} 상태 변경`}
                    className="shrink-0 rounded-lg border border-[#E5E7EB] bg-white px-2 py-2 text-sm"
                    disabled={updatingId === task.id}
                    onChange={(event) =>
                      void handleStatusChange(task, event.target.value as TaskStatus)
                    }
                    value={task.status}
                  >
                    {taskStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                {task.goal ? (
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#374151]">
                    {task.goal}
                  </p>
                ) : null}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {task.satisfaction ? (
                    <span className="rounded bg-[#F7F8FA] px-2 py-1 text-xs text-[#374151]">
                      만족도 {task.satisfaction}/5
                    </span>
                  ) : null}
                  {task.tags.map((tag) => (
                    <span className="rounded bg-[#F7F8FA] px-2 py-1 text-xs" key={tag}>
                      #{tag}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-[#6B7280]">
                  상태: {getTaskStatusLabel(task.status)}
                </p>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
