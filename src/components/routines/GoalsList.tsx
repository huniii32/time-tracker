"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/common/Card";
import { listGoals } from "@/lib/queries/goals";
import {
  getGoalLevelLabel,
  getGoalTypeLabel,
  getPriorityLabel,
} from "@/lib/routines/goals";
import { createClient } from "@/lib/supabase/browser";
import type { Goal } from "@/types";

export function GoalsList() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGoals() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      const { data, error: listError } = await listGoals(supabase, user.id);

      if (listError) {
        setError(listError.message);
      } else {
        setGoals(data ?? []);
      }

      setLoading(false);
    }

    void loadGoals();
  }, []);

  if (loading) {
    return <Card>목표를 불러오는 중입니다.</Card>;
  }

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-[#C92735]">{error}</p> : null}

      {goals.length === 0 ? (
        <Card>
          <h2 className="font-semibold text-[#1F2F5C]">아직 목표가 없습니다.</h2>
          <p className="mt-2 text-sm text-[#6B7280]">
            3개월 목표를 분기, 월간, 주간, 일간 단위로 나눠 첫 목표를 기록해보세요.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => (
            <Link className="block" href={`/routines/goals/${goal.id}`} key={goal.id}>
              <Card>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded bg-[#EAF1FF] px-2 py-1 text-xs font-semibold text-[#1F2F5C]">
                        {getGoalTypeLabel(goal.goal_type)}
                      </span>
                      <span className="rounded bg-[#F7F8FA] px-2 py-1 text-xs font-semibold text-[#374151]">
                        {getGoalLevelLabel(goal.goal_level)}
                      </span>
                    </div>
                    <h2 className="mt-2 text-lg font-bold text-[#1F2F5C]">{goal.title}</h2>
                  </div>
                  <span className="shrink-0 rounded bg-[#F7F8FA] px-2 py-1 text-xs font-semibold text-[#374151]">
                    {goal.progress}%
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded bg-[#F7F8FA] px-2 py-1 text-xs text-[#374151]">
                    우선순위 {getPriorityLabel(goal.priority)}
                  </span>
                  {goal.period ? (
                    <span className="rounded bg-[#F7F8FA] px-2 py-1 text-xs text-[#374151]">
                      기간 {goal.period}
                    </span>
                  ) : null}
                </div>
                {goal.success_criteria ? (
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#374151]">
                    성공 기준: {goal.success_criteria}
                  </p>
                ) : null}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
