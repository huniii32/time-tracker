"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/common/Card";
import { listWeeklyReviews } from "@/lib/queries/weeklyReviews";
import { createClient } from "@/lib/supabase/browser";
import type { WeeklyReview } from "@/types";

export function WeeklyReviewsList() {
  const [reviews, setReviews] = useState<WeeklyReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReviews() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      const { data, error: listError } = await listWeeklyReviews(supabase, user.id);

      if (listError) {
        setError(listError.message);
      } else {
        setReviews(data ?? []);
      }

      setLoading(false);
    }

    void loadReviews();
  }, []);

  if (loading) {
    return <Card>위클리 피드백을 불러오는 중입니다.</Card>;
  }

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-[#C92735]">{error}</p> : null}

      {reviews.length === 0 ? (
        <Card>
          <h2 className="font-semibold text-[#1F2F5C]">아직 위클리 피드백이 없습니다.</h2>
          <p className="mt-2 text-sm text-[#6B7280]">
            이번 주 목표와 다음 주 적용점을 첫 기록으로 남겨보세요.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <Link
              className="block"
              href={`/routines/weekly-reviews/${review.id}`}
              key={review.id}
            >
              <Card>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="rounded bg-[#EAF1FF] px-2 py-1 text-xs font-semibold text-[#1F2F5C]">
                      {review.week_start}
                    </span>
                    <h2 className="mt-2 text-lg font-bold text-[#1F2F5C]">
                      {review.goals || "이번 주 회고"}
                    </h2>
                  </div>
                  <span className="shrink-0 rounded bg-[#F7F8FA] px-2 py-1 text-xs font-semibold text-[#374151]">
                    {review.achievement_rate ?? 0}%
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded bg-[#F7F8FA] px-2 py-1 text-xs text-[#374151]">
                    낭비 시간 {review.wasted_hours ?? "-"}h
                  </span>
                  <span className="rounded bg-[#F7F8FA] px-2 py-1 text-xs text-[#374151]">
                    루틴 만족도{" "}
                    {review.routine_satisfaction ? `${review.routine_satisfaction}/5` : "-"}
                  </span>
                </div>
                {review.next_week_action ? (
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#374151]">
                    다음 주 적용점: {review.next_week_action}
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
