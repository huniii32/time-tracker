"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/common/Card";
import {
  deleteWeeklyReview,
  getWeeklyReview,
} from "@/lib/queries/weeklyReviews";
import { createClient } from "@/lib/supabase/browser";
import type { WeeklyReview } from "@/types";

export function WeeklyReviewDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [review, setReview] = useState<WeeklyReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadReview() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data, error: reviewError } = await getWeeklyReview(supabase, user.id, params.id);

      if (reviewError) {
        setError(reviewError.message);
      } else {
        setReview(data);
      }

      setLoading(false);
    }

    void loadReview();
  }, [params.id, router]);

  async function handleDelete() {
    if (!review || !confirm("이 위클리 피드백을 삭제할까요?")) {
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

    const { error: deleteError } = await deleteWeeklyReview(supabase, user.id, review.id);

    if (deleteError) {
      setError(deleteError.message);
      setDeleting(false);
      return;
    }

    router.replace("/routines/weekly-reviews");
    router.refresh();
  }

  if (loading) {
    return <Card>위클리 피드백을 불러오는 중입니다.</Card>;
  }

  if (!review) {
    return (
      <Card>
        <h2 className="font-semibold text-[#1F2F5C]">위클리 피드백을 찾을 수 없습니다.</h2>
        {error ? <p className="mt-2 text-sm text-[#C92735]">{error}</p> : null}
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <span className="rounded bg-[#EAF1FF] px-2 py-1 text-xs font-semibold text-[#1F2F5C]">
          {review.week_start}
        </span>
        <h2 className="mt-3 text-2xl font-bold text-[#1F2F5C]">위클리 피드백</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="font-semibold text-[#6B7280]">목표 달성률</dt>
            <dd className="mt-1 text-[#111827]">{review.achievement_rate ?? 0}%</dd>
          </div>
          <div>
            <dt className="font-semibold text-[#6B7280]">낭비 시간</dt>
            <dd className="mt-1 text-[#111827]">{review.wasted_hours ?? "-"}h</dd>
          </div>
          <div>
            <dt className="font-semibold text-[#6B7280]">루틴 만족도</dt>
            <dd className="mt-1 text-[#111827]">
              {review.routine_satisfaction ? `${review.routine_satisfaction}/5` : "-"}
            </dd>
          </div>
        </dl>
      </Card>

      <Card>
        <dl className="space-y-4">
          {[
            ["이번 주 목표", review.goals],
            ["가장 잘한 점", review.best],
            ["아쉬웠던 점", review.regret],
            ["배운 점", review.learned],
            ["다음 주 적용점", review.next_week_action],
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
          href={`/routines/weekly-reviews/${review.id}/edit`}
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
