"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/common/Card";
import { deleteGoal, getGoal } from "@/lib/queries/goals";
import {
  getGoalLevelLabel,
  getGoalTypeLabel,
  getPriorityLabel,
} from "@/lib/routines/goals";
import { createClient } from "@/lib/supabase/browser";
import type { Goal } from "@/types";

export function GoalDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadGoal() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data, error: goalError } = await getGoal(supabase, user.id, params.id);

      if (goalError) {
        setError(goalError.message);
      } else {
        setGoal(data);
      }

      setLoading(false);
    }

    void loadGoal();
  }, [params.id, router]);

  async function handleDelete() {
    if (!goal || !confirm("이 목표를 삭제할까요?")) {
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

    const { error: deleteError } = await deleteGoal(supabase, user.id, goal.id);

    if (deleteError) {
      setError(deleteError.message);
      setDeleting(false);
      return;
    }

    router.replace("/routines/goals");
    router.refresh();
  }

  if (loading) {
    return <Card>목표를 불러오는 중입니다.</Card>;
  }

  if (!goal) {
    return (
      <Card>
        <h2 className="font-semibold text-[#1F2F5C]">목표를 찾을 수 없습니다.</h2>
        {error ? <p className="mt-2 text-sm text-[#C92735]">{error}</p> : null}
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap gap-2">
          <span className="rounded bg-[#EAF1FF] px-2 py-1 text-xs font-semibold text-[#1F2F5C]">
            {getGoalTypeLabel(goal.goal_type)}
          </span>
          <span className="rounded bg-[#F7F8FA] px-2 py-1 text-xs font-semibold text-[#374151]">
            {getGoalLevelLabel(goal.goal_level)}
          </span>
          <span className="rounded bg-[#F7F8FA] px-2 py-1 text-xs font-semibold text-[#374151]">
            우선순위 {getPriorityLabel(goal.priority)}
          </span>
        </div>
        <h2 className="mt-3 text-2xl font-bold text-[#1F2F5C]">{goal.title}</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-[#6B7280]">기간</dt>
            <dd className="mt-1 text-[#111827]">{goal.period || "-"}</dd>
          </div>
          <div>
            <dt className="font-semibold text-[#6B7280]">진행률</dt>
            <dd className="mt-1 text-[#111827]">{goal.progress}%</dd>
          </div>
        </dl>
      </Card>

      <Card>
        <dl className="space-y-4">
          {[
            ["성공 기준", goal.success_criteria],
            ["회고", goal.retrospective],
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
          href={`/routines/goals/${goal.id}/edit`}
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
