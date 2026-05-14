"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DashboardCard, EmptyState, MetricCard, Pill } from "@/components/common/ui";
import { getKstWeekRange } from "@/lib/dates";
import { listTimeLogs } from "@/lib/queries/timeLogs";
import { getRoutineCompletionsForRange } from "@/lib/routines/routineCompletions";
import { getUserRoutines } from "@/lib/routines/routines";
import { formatDuration, formatMinutes, getDurationMinutes, getTimeLogCategoryLabel, getTodayDate } from "@/lib/routines/timeLogs";
import { createClient } from "@/lib/supabase/browser";
import type { Routine, RoutineCompletion, TimeLog } from "@/types";
import { RoutineProgressSummary } from "./RoutineProgressSummary";

export function TimeLogsList() {
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [routineCompletions, setRoutineCompletions] = useState<RoutineCompletion[]>([]);
  const [userId, setUserId] = useState("");
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

      setUserId(user.id);

      const weekRange = getKstWeekRange();
      const [timeLogsResult, routinesResult, completionsResult] = await Promise.all([
        listTimeLogs(supabase, user.id),
        getUserRoutines(supabase, user.id),
        getRoutineCompletionsForRange(supabase, user.id, weekRange.start.key, weekRange.end.key),
      ]);

      const loadError = timeLogsResult.error ?? routinesResult.error ?? completionsResult.error;

      if (loadError) {
        setError(loadError.message);
      } else {
        setTimeLogs(timeLogsResult.data ?? []);
        setRoutines(routinesResult.data ?? []);
        setRoutineCompletions(completionsResult.data ?? []);
      }

      setLoading(false);
    }

    void loadTimeLogs();
  }, []);

  if (loading) {
    return <DashboardCard>시간 기록을 불러오는 중입니다.</DashboardCard>;
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
      {error ? <p className="text-sm text-[#78716c]">{error}</p> : null}

      <RoutineProgressSummary
        initialRoutineCompletions={routineCompletions}
        initialRoutines={routines}
        timeLogs={timeLogs}
        userId={userId}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard detail={today} label="오늘 기록 시간" value={formatMinutes(todayTotalMinutes)} />
        <MetricCard label="오늘 기록 수" value={`${todayTimeLogs.length}건`} />
      </div>

      <DashboardCard>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#0c0a09]">오늘의 시간 기록</h2>
            <p className="mt-1 text-sm text-[#78716c]">{today}</p>
          </div>
          <Pill>총 {formatMinutes(todayTotalMinutes)}</Pill>
        </div>

        {todayTimeLogs.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              description="오늘 사용한 시간을 첫 데일리 기록으로 남겨보세요."
              title="아직 시간 기록이 없습니다."
            />
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {todayTimeLogs.map((timeLog) => (
              <Link
                className="grid grid-cols-[72px_1fr] gap-3 sm:grid-cols-[96px_1fr]"
                href={`/routines/time-logs/${timeLog.id}`}
                key={timeLog.id}
              >
                <div className="pt-1 text-right">
                  <div className="text-sm font-semibold text-[#0c0a09]">{timeLog.start_time.slice(0, 5)}</div>
                  <div className="text-xs font-medium text-[#78716c]">{timeLog.end_time.slice(0, 5)}</div>
                </div>
                <div className="relative border-l border-[#d6d3d1] pl-4">
                  <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#3ba6f1]" />
                  <div className="rounded-[10px] border border-[#e5e7eb] bg-white p-4 shadow-[rgba(0,0,0,0.05)_0px_4px_16px_0px]">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-semibold text-[#0c0a09]">{timeLog.activity}</h3>
                        <p className="mt-1 text-sm text-[#78716c]">
                          {getTimeLogCategoryLabel(timeLog.category)} · 집중도 {timeLog.focus_score ? `${timeLog.focus_score}/5` : "-"}
                        </p>
                      </div>
                      <Pill>{formatDuration(timeLog.start_time, timeLog.end_time)}</Pill>
                    </div>
                    {timeLog.memo ? <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#78716c]">{timeLog.memo}</p> : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </DashboardCard>
    </div>
  );
}
