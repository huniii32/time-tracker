"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/common/Card";
import { listTimeLogs } from "@/lib/queries/timeLogs";
import { formatDuration } from "@/lib/routines/timeLogs";
import { createClient } from "@/lib/supabase/browser";
import type { TimeLog } from "@/types";
import { TimeLogCategoryBadge } from "./TimeLogBadges";

export function TimeLogsList() {
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTimeLogs() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      const { data, error: listError } = await listTimeLogs(supabase, user.id);

      if (listError) {
        setError(listError.message);
      } else {
        setTimeLogs(data ?? []);
      }

      setLoading(false);
    }

    void loadTimeLogs();
  }, []);

  if (loading) {
    return <Card>시간 기록을 불러오는 중입니다.</Card>;
  }

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-[#C92735]">{error}</p> : null}

      {timeLogs.length === 0 ? (
        <Card>
          <h2 className="font-semibold text-[#1F2F5C]">아직 시간 기록이 없습니다.</h2>
          <p className="mt-2 text-sm text-[#6B7280]">
            오늘 사용한 시간을 첫 데일리 기록으로 남겨보세요.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {timeLogs.map((timeLog) => (
            <Link className="block" href={`/routines/time-logs/${timeLog.id}`} key={timeLog.id}>
              <Card>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <TimeLogCategoryBadge category={timeLog.category} />
                    <h2 className="mt-2 text-lg font-bold text-[#1F2F5C]">
                      {timeLog.activity}
                    </h2>
                    <p className="mt-1 text-sm text-[#6B7280]">
                      {timeLog.log_date} · {timeLog.start_time.slice(0, 5)}-
                      {timeLog.end_time.slice(0, 5)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded bg-[#F7F8FA] px-2 py-1 text-xs font-semibold text-[#374151]">
                    {formatDuration(timeLog.start_time, timeLog.end_time)}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded bg-[#F7F8FA] px-2 py-1 text-xs text-[#374151]">
                    집중도 {timeLog.focus_score ? `${timeLog.focus_score}/5` : "-"}
                  </span>
                  <span className="rounded bg-[#F7F8FA] px-2 py-1 text-xs text-[#374151]">
                    만족도 {timeLog.satisfaction ? `${timeLog.satisfaction}/5` : "-"}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
