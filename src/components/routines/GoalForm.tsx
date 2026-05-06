"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { createGoal, updateGoal } from "@/lib/queries/goals";
import {
  buildGoalInsert,
  buildGoalUpdate,
  getGoalTypeDescription,
  getInitialGoalFormValues,
  goalLevelOptions,
  goalTypeOptions,
  priorityOptions,
  type GoalFormValues,
} from "@/lib/routines/goals";
import { createClient } from "@/lib/supabase/browser";
import type { Goal } from "@/types";

type GoalFormProps = {
  mode: "create" | "edit";
  goal?: Goal;
};

export function GoalForm({ mode, goal }: GoalFormProps) {
  const router = useRouter();
  const initialValues = useMemo(() => getInitialGoalFormValues(goal), [goal]);
  const [values, setValues] = useState<GoalFormValues>(initialValues);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField<T extends keyof GoalFormValues>(name: T, value: GoalFormValues[T]) {
    setValues((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      if (mode === "create") {
        const { data, error: createError } = await createGoal(
          supabase,
          user.id,
          buildGoalInsert(values),
        );

        if (createError) {
          setError(createError.message);
          return;
        }

        router.replace(`/routines/goals/${data.id}`);
        router.refresh();
        return;
      }

      if (!goal) {
        setError("?섏젙??紐⑺몴瑜?李얠쓣 ???놁뒿?덈떎.");
        return;
      }

      const { data, error: updateError } = await updateGoal(
        supabase,
        user.id,
        goal.id,
        buildGoalUpdate(values),
      );

      if (updateError) {
        setError(updateError.message);
        return;
      }

      router.replace(`/routines/goals/${data.id}`);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            紐⑺몴紐?            <input
              className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("title", event.target.value)}
              required
              value={values.title}
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-[#1F2F5C]">
              紐⑺몴 ?좏삎
              <select
                className="mt-1 w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-3 text-base"
                onChange={(event) =>
                  updateField("goal_type", event.target.value as GoalFormValues["goal_type"])
                }
                value={values.goal_type}
              >
                {goalTypeOptions.map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-semibold text-[#1F2F5C]">
              紐⑺몴 ?덈꺼
              <select
                className="mt-1 w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-3 text-base"
                onChange={(event) =>
                  updateField("goal_level", event.target.value as GoalFormValues["goal_level"])
                }
                value={values.goal_level}
              >
                {goalLevelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <p className="rounded-lg bg-[#F7F8FA] px-3 py-2 text-xs leading-5 text-[#6B7280]">
            {getGoalTypeDescription(values.goal_type)}
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block text-sm font-semibold text-[#1F2F5C]">
              湲곌컙
              <input
                className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
                onChange={(event) => updateField("period", event.target.value)}
                placeholder="예: 2026 Q2, 5월, 이번 주"
                value={values.period}
              />
            </label>

            <label className="block text-sm font-semibold text-[#1F2F5C]">
              ?곗꽑?쒖쐞
              <select
                className="mt-1 w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-3 text-base"
                onChange={(event) =>
                  updateField("priority", event.target.value as GoalFormValues["priority"])
                }
                value={values.priority}
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-semibold text-[#1F2F5C]">
              吏꾪뻾瑜?              <input
                className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
                max={100}
                min={0}
                onChange={(event) => updateField("progress", event.target.value)}
                placeholder="0-100"
                type="number"
                value={values.progress}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            ?깃났 湲곗?
            <textarea
              className="mt-1 min-h-28 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("success_criteria", event.target.value)}
              value={values.success_criteria}
            />
          </label>
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            ?뚭퀬
            <textarea
              className="mt-1 min-h-28 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("retrospective", event.target.value)}
              value={values.retrospective}
            />
          </label>
        </div>
      </div>

      {error ? <p className="text-sm text-[#C92735]">{error}</p> : null}

      <div className="form-actions grid grid-cols-2 gap-3">
        <button
          className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-bold text-[#1F2F5C]"
          onClick={() => router.back()}
          type="button"
        >취소</button>
        <button
          className="rounded-lg bg-[#1F2F5C] px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
          disabled={saving}
          type="submit"
        >
          {saving ? "저장 중" : mode === "create" ? "작성" : "수정"}
        </button>
      </div>
    </form>
  );
}
