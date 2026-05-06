"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/common/Card";
import { getGoal } from "@/lib/queries/goals";
import { createClient } from "@/lib/supabase/browser";
import type { Goal } from "@/types";
import { GoalForm } from "./GoalForm";

export function EditGoalLoader() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return <GoalForm mode="edit" goal={goal} />;
}
