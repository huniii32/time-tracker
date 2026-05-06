"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/common/Card";
import { getWeeklyReview } from "@/lib/queries/weeklyReviews";
import { createClient } from "@/lib/supabase/browser";
import type { WeeklyReview } from "@/types";
import { WeeklyReviewForm } from "./WeeklyReviewForm";

export function EditWeeklyReviewLoader() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [review, setReview] = useState<WeeklyReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return <WeeklyReviewForm mode="edit" review={review} />;
}
