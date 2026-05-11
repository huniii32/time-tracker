"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/common/Card";
import { listTimeLogs } from "@/lib/queries/timeLogs";
import {
  formatDuration,
  formatMinutes,
  getDurationMinutes,
  getTimeLogCategoryLabel,
  getTodayDate,
} from "@/lib/routines/timeLogs";
import { createClient } from "@/lib/supabase/browser";
import type { TimeLog } from "@/types";
import { RoutineProgressSummary } from "./RoutineProgressSummary";

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

  const today = getTodayDate();
  const todayTimeLogs = timeLogs
    .filter((timeLog) => timeLog.log_date === today)
    .sort((first, second) => first.start_time.localeCompare(second.start_time));
  const todayTotalMinutes = todayTimeLogs.reduce(
    (total, timeLog) => total + getDurationMinutes(timeLog.start_time, timeLog.end_time),
    0,
  );

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-[#C92735]">{error}</p> : null}

      <RoutineProgressSummary timeLogs={timeLogs} />

      <Card>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#1F2F5C]">오늘의 시간 기록</h2>
            <p className="mt-1 text-sm text-[#6B7280]">{today}</p>
          </div>
          <span className="w-fit rounded-lg bg-[#EEF4FF] px-3 py-1 text-xs font-bold text-[#1F2F5C]">
            총 {formatMinutes(todayTotalMinutes)}
          </span>
        </div>

        {todayTimeLogs.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-6">
            <h2 className="font-semibold text-[#1F2F5C]">아직 시간 기록이 없습니다.</h2>
            <p className="mt-2 text-sm text-[#6B7280]">
              오늘 사용한 시간을 첫 데일리 기록으로 남겨보세요.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {todayTimeLogs.map((timeLog) => (
              <Link
                className="grid grid-cols-[82px_1fr] gap-3 sm:grid-cols-[112px_1fr]"
                href={`/routines/time-logs/${timeLog.id}`}
                key={timeLog.id}
              >
                <div className="pt-1 text-right">
                  <div className="text-sm font-extrabold text-[#1F2F5C]">{timeLog.start_time.slice(0, 5)}</div>
                  <div className="text-xs font-semibold text-[#667085]">{timeLog.end_time.slice(0, 5)}</div>
                </div>
                <div className="relative border-l-2 border-[#D8E2F6] pl-4">
                  <span className="absolute -left-[7px] top-2 h-3 w-3 rounded-full border-2 border-white bg-[#0B1F4D]" />
                  <div className="rounded-xl border border-[#E3E8F2] bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-bold text-[#1F2F5C]">{timeLog.activity}</h3>
                        <p className="mt-1 text-sm text-[#6B7280]">
                          {getTimeLogCategoryLabel(timeLog.category)} · 집중도{" "}
                          {timeLog.focus_score ? `${timeLog.focus_score}/5` : "-"}
                        </p>
                      </div>
                      <span className="w-fit shrink-0 rounded bg-[#F7F8FA] px-2 py-1 text-xs font-semibold text-[#374151]">
                        {formatDuration(timeLog.start_time, timeLog.end_time)}
                      </span>
                    </div>
                    {timeLog.memo ? <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#4B5563]">{timeLog.memo}</p> : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
