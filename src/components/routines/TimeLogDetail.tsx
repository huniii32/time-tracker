"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/common/Card";
import { deleteTimeLog, getTimeLog } from "@/lib/queries/timeLogs";
import { formatDuration } from "@/lib/routines/timeLogs";
import { createClient } from "@/lib/supabase/browser";
import type { TimeLog } from "@/types";
import { TimeLogCategoryBadge } from "./TimeLogBadges";

export function TimeLogDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [timeLog, setTimeLog] = useState<TimeLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadTimeLog() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data, error: timeLogError } = await getTimeLog(supabase, user.id, params.id);

      if (timeLogError) {
        setError(timeLogError.message);
      } else {
        setTimeLog(data);
      }

      setLoading(false);
    }

    void loadTimeLog();
  }, [params.id, router]);

  async function handleDelete() {
    if (!timeLog || !confirm("이 시간 기록을 삭제할까요?")) {
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

    const { error: deleteError } = await deleteTimeLog(supabase, user.id, timeLog.id);

    if (deleteError) {
      setError(deleteError.message);
      setDeleting(false);
      return;
    }

    router.replace("/routines");
    router.refresh();
  }

  if (loading) {
    return <Card>시간 기록을 불러오는 중입니다.</Card>;
  }

  if (!timeLog) {
    return (
      <Card>
        <h2 className="font-semibold text-[#1F2F5C]">시간 기록을 찾을 수 없습니다.</h2>
        {error ? <p className="mt-2 text-sm text-[#C92735]">{error}</p> : null}
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <TimeLogCategoryBadge category={timeLog.category} />
        <h2 className="mt-3 text-2xl font-bold text-[#1F2F5C]">{timeLog.activity}</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-[#6B7280]">날짜</dt>
            <dd className="mt-1 text-[#111827]">{timeLog.log_date}</dd>
          </div>
          <div>
            <dt className="font-semibold text-[#6B7280]">기록 시간</dt>
            <dd className="mt-1 text-[#111827]">
              {timeLog.start_time.slice(0, 5)}-{timeLog.end_time.slice(0, 5)} ·{" "}
              {formatDuration(timeLog.start_time, timeLog.end_time)}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-[#6B7280]">집중도</dt>
            <dd className="mt-1 text-[#111827]">
              {timeLog.focus_score ? `${timeLog.focus_score}/5` : "-"}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-[#6B7280]">만족도</dt>
            <dd className="mt-1 text-[#111827]">
              {timeLog.satisfaction ? `${timeLog.satisfaction}/5` : "-"}
            </dd>
          </div>
        </dl>
      </Card>

      <Card>
        <h2 className="font-semibold text-[#1F2F5C]">메모</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#374151]">
          {timeLog.memo || "-"}
        </p>
      </Card>

      {error ? <p className="text-sm text-[#C92735]">{error}</p> : null}

      <div className="grid grid-cols-2 gap-3">
        <Link
          className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-center text-sm font-bold text-[#1F2F5C]"
          href={`/routines/time-logs/${timeLog.id}/edit`}
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
