"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/common/Card";
import { deleteTask, getTask } from "@/lib/queries/tasks";
import { createClient } from "@/lib/supabase/browser";
import { isDueSoon, isOverdue } from "@/lib/tasks/config";
import type { Task } from "@/types";
import { TaskPriorityBadge, TaskStatusBadge } from "./TaskBadges";

export function TaskDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadTask() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data, error: taskError } = await getTask(supabase, user.id, params.id);

      if (taskError) {
        setError(taskError.message);
      } else {
        setTask(data);
      }

      setLoading(false);
    }

    void loadTask();
  }, [params.id, router]);

  async function handleDelete() {
    if (!task || !confirm("이 업무를 삭제할까요?")) {
      return;
    }

    setDeleting(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const { error: deleteError } = await deleteTask(supabase, user.id, task.id);

    if (deleteError) {
      setError(deleteError.message);
      setDeleting(false);
      return;
    }

    router.replace("/tasks");
    router.refresh();
  }

  if (loading) {
    return <Card>업무를 불러오는 중입니다.</Card>;
  }

  if (!task) {
    return (
      <Card>
        <h2 className="font-semibold text-[#1F2F5C]">업무를 찾을 수 없습니다.</h2>
        {error ? <p className="mt-2 text-sm text-[#C92735]">{error}</p> : null}
      </Card>
    );
  }

  const dueSoon = isDueSoon(task.due_date, task.status);
  const overdue = isOverdue(task.due_date, task.status);

  return (
    <div className="space-y-4">
      <Card className={dueSoon || overdue ? "border-[#C92735]" : ""}>
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
        <h2 className="mt-3 text-2xl font-bold text-[#1F2F5C]">{task.title}</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-[#6B7280]">요청자</dt>
            <dd className="mt-1 text-[#111827]">{task.requester ?? "-"}</dd>
          </div>
          <div>
            <dt className="font-semibold text-[#6B7280]">마감기한</dt>
            <dd className="mt-1 text-[#111827]">{task.due_date ?? "-"}</dd>
          </div>
          <div>
            <dt className="font-semibold text-[#6B7280]">만족도</dt>
            <dd className="mt-1 text-[#111827]">
              {task.satisfaction ? `${task.satisfaction}/5` : "-"}
            </dd>
          </div>
        </dl>
        {task.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {task.tags.map((tag) => (
              <span className="rounded bg-[#F7F8FA] px-2 py-1 text-xs" key={tag}>
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </Card>

      <Card>
        <dl className="space-y-4">
          {[
            ["목표", task.goal],
            ["결과물", task.output],
            ["피드백", task.feedback],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-semibold text-[#6B7280]">{label}</dt>
              <dd className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#111827]">
                {value || "-"}
              </dd>
            </div>
          ))}
        </dl>
      </Card>

      {error ? <p className="text-sm text-[#C92735]">{error}</p> : null}

      <div className="grid grid-cols-2 gap-3">
        <Link
          className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-center text-sm font-bold text-[#1F2F5C]"
          href={`/tasks/${task.id}/edit`}
        >
          수정
        </Link>
        <button
          className="rounded-lg bg-[#C92735] px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
          disabled={deleting}
          onClick={() => void handleDelete()}
          type="button"
        >
          {deleting ? "삭제 중" : "삭제"}
        </button>
      </div>
    </div>
  );
}
