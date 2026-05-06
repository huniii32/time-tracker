"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import {
  createWeeklyReview,
  updateWeeklyReview,
} from "@/lib/queries/weeklyReviews";
import {
  buildWeeklyReviewInsert,
  buildWeeklyReviewUpdate,
  getInitialWeeklyReviewFormValues,
  type WeeklyReviewFormValues,
} from "@/lib/routines/weeklyReviews";
import { createClient } from "@/lib/supabase/browser";
import type { WeeklyReview } from "@/types";

type WeeklyReviewFormProps = {
  mode: "create" | "edit";
  review?: WeeklyReview;
};

export function WeeklyReviewForm({ mode, review }: WeeklyReviewFormProps) {
  const router = useRouter();
  const initialValues = useMemo(() => getInitialWeeklyReviewFormValues(review), [review]);
  const [values, setValues] = useState<WeeklyReviewFormValues>(initialValues);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField(name: keyof WeeklyReviewFormValues, value: string) {
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
        const { data, error: createError } = await createWeeklyReview(
          supabase,
          user.id,
          buildWeeklyReviewInsert(values),
        );

        if (createError) {
          setError(createError.message);
          return;
        }

        router.replace(`/routines/weekly-reviews/${data.id}`);
        router.refresh();
        return;
      }

      if (!review) {
        setError("?섏젙???꾪겢由??쇰뱶諛깆쓣 李얠쓣 ???놁뒿?덈떎.");
        return;
      }

      const { data, error: updateError } = await updateWeeklyReview(
        supabase,
        user.id,
        review.id,
        buildWeeklyReviewUpdate(values),
      );

      if (updateError) {
        setError(updateError.message);
        return;
      }

      router.replace(`/routines/weekly-reviews/${data.id}`);
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
            二??쒖옉??            <input
              className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("week_start", event.target.value)}
              required
              type="date"
              value={values.week_start}
            />
          </label>
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            ?대쾲 二?紐⑺몴
            <textarea
              className="mt-1 min-h-24 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("goals", event.target.value)}
              value={values.goals}
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block text-sm font-semibold text-[#1F2F5C]">
              紐⑺몴 ?ъ꽦瑜?              <input
                className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
                max={100}
                min={0}
                onChange={(event) => updateField("achievement_rate", event.target.value)}
                placeholder="0-100"
                type="number"
                value={values.achievement_rate}
              />
            </label>
            <label className="block text-sm font-semibold text-[#1F2F5C]">
              ??퉬 ?쒓컙
              <input
                className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
                min={0}
                onChange={(event) => updateField("wasted_hours", event.target.value)}
                placeholder="?쒓컙"
                step="0.5"
                type="number"
                value={values.wasted_hours}
              />
            </label>
            <label className="block text-sm font-semibold text-[#1F2F5C]">
              猷⑦떞 留뚯”??              <input
                className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
                max={5}
                min={1}
                onChange={(event) => updateField("routine_satisfaction", event.target.value)}
                placeholder="1-5"
                type="number"
                value={values.routine_satisfaction}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            媛???섑븳 ??            <textarea
              className="mt-1 min-h-24 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("best", event.target.value)}
              value={values.best}
            />
          </label>
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            ?꾩돩?좊뜕 ??            <textarea
              className="mt-1 min-h-24 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("regret", event.target.value)}
              value={values.regret}
            />
          </label>
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            諛곗슫 ??            <textarea
              className="mt-1 min-h-24 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("learned", event.target.value)}
              value={values.learned}
            />
          </label>
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            ?ㅼ쓬 二??곸슜??            <textarea
              className="mt-1 min-h-24 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("next_week_action", event.target.value)}
              value={values.next_week_action}
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
