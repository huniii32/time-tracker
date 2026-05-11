"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/common/Card";
import {
  getKstDateParts,
  getKstMonthCalendarDays,
  getKstWeekRange,
  kstWeekdayLabels,
  type KstWeekDay,
} from "@/lib/dates";
import { getTimeLogCategoryLabel } from "@/lib/routines/timeLogs";
import type { TimeLog, TimeLogCategory } from "@/types";

type RoutineProgressSummaryProps = {
  timeLogs: TimeLog[];
};

type CalendarDay = {
  key: string;
  dayOfMonth: number;
  isToday: boolean;
  logs: TimeLog[];
};

type RoutineDefinition = {
  name: string;
  categories: TimeLogCategory[];
  keywords: string[];
};

type RoutineCompletionMap = Record<string, boolean>;

type WeeklyRoutineGridItem = RoutineDefinition & {
  days: Array<KstWeekDay & { completed: boolean }>;
};

const routineDefinitions: RoutineDefinition[] = [
  {
    name: "개발 공부",
    categories: ["coding_study", "paper_review"],
    keywords: ["공부", "개발", "코딩", "논문", "학습"],
  },
  {
    name: "업무 집중",
    categories: ["company_work", "onboarding_log"],
    keywords: ["업무", "회사", "작업", "프로젝트"],
  },
  {
    name: "운동",
    categories: ["exercise"],
    keywords: ["운동", "헬스", "산책", "러닝"],
  },
  {
    name: "회고 작성",
    categories: ["onboarding_log"],
    keywords: ["회고", "정리", "기록"],
  },
];

export function RoutineProgressSummary({ timeLogs }: RoutineProgressSummaryProps) {
  const { year, month } = getKstDateParts();
  const monthDays = useMemo(() => buildMonthDays(timeLogs), [timeLogs]);
  const monthLogs = monthDays.flatMap((day) => day.logs);
  const weekDays = useMemo(() => getKstWeekRange().days, []);
  const weekDayKeys = useMemo(() => new Set(weekDays.map((day) => day.key)), [weekDays]);
  const weekLogs = useMemo(
    () => timeLogs.filter((timeLog) => weekDayKeys.has(timeLog.log_date)),
    [timeLogs, weekDayKeys],
  );
  const weeklyRoutineGrid = useMemo(
    () => buildWeeklyRoutineGrid(routineDefinitions, weekLogs, weekDays),
    [weekLogs, weekDays],
  );
  const [routineCompletionOverrides, setRoutineCompletionOverrides] = useState<RoutineCompletionMap>({});

  function handleRoutineCheckToggle(routineName: string, dateKey: string, fallbackCompleted: boolean) {
    const key = getRoutineCompletionKey(routineName, dateKey);

    setRoutineCompletionOverrides((current) => ({
      ...current,
      [key]: !getRoutineCompletionState(current, routineName, dateKey, fallbackCompleted),
    }));
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#1F2F5C]">월간 캘린더</h2>
            <p className="mt-1 text-sm text-[#6B7280]">
              {year}년 {month}월 시간 기록
            </p>
          </div>
          <span className="rounded-lg bg-[#EEF4FF] px-3 py-1 text-xs font-bold text-[#1F2F5C]">
            기록 {monthLogs.length}개
          </span>
        </div>

        {monthLogs.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-6 text-center text-sm text-[#6B7280]">
            아직 이번 달 시간 기록이 없습니다.
          </div>
        ) : null}

        <div className="mt-4 overflow-x-auto">
          <div className="min-w-[620px]">
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-[#667085]">
              {kstWeekdayLabels.map((weekday) => (
                <div className="py-2" key={weekday}>
                  {weekday}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {monthDays.map((day, index) =>
                day.key ? (
                  <div
                    className={`min-h-28 rounded-lg border px-2 py-2 text-sm ${
                      day.isToday
                        ? "border-[#0B1F4D] bg-[#EEF4FF] text-[#0B1F4D]"
                        : day.logs.length > 0
                          ? "border-[#BFD0F5] bg-[#F8FAFC] text-[#374151]"
                          : "border-[#E5E7EB] bg-white text-[#374151]"
                    }`}
                    key={day.key}
                  >
                    <div className="font-extrabold">{day.dayOfMonth}</div>
                    <div className="mt-2 space-y-1">
                      {day.logs.slice(0, 2).map((timeLog) => (
                        <div
                          className="truncate rounded-md bg-white px-2 py-1 text-[11px] font-semibold text-[#1F2F5C] shadow-sm"
                          key={timeLog.id}
                          title={timeLog.activity}
                        >
                          {timeLog.activity}
                        </div>
                      ))}
                      {day.logs.length > 2 ? (
                        <div className="text-[11px] font-bold text-[#667085]">+{day.logs.length - 2}개</div>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div className="min-h-28" key={`empty-${index}`} />
                ),
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-bold text-[#1F2F5C]">이번 주 루틴 현황</h2>
        <p className="mt-1 text-sm text-[#6B7280]">반복 행동을 월요일부터 일요일까지 체크합니다.</p>

        {weekLogs.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-4 text-center text-sm text-[#6B7280]">
            아직 이번 주 루틴 기록이 없습니다.
          </div>
        ) : null}

        <div className="mt-4 overflow-x-auto">
          <div className="min-w-[620px] rounded-xl border border-[#E5E7EB]">
            <div className="grid grid-cols-[minmax(140px,1.4fr)_repeat(7,minmax(64px,1fr))] border-b border-[#E5E7EB] bg-[#F8FAFC] text-center text-xs font-bold text-[#667085]">
              <div className="px-3 py-3 text-left">루틴</div>
              {weekDays.map((day) => (
                <div
                  className={`px-2 py-3 ${day.isToday ? "bg-[#EEF4FF] text-[#0B1F4D]" : ""}`}
                  key={day.key}
                >
                  <span>{day.label}</span>
                  <span className="mt-1 block font-semibold text-[#98A2B3]">{day.dayOfMonth}</span>
                </div>
              ))}
            </div>
            {weeklyRoutineGrid.map((routine) => (
              <div
                className="grid grid-cols-[minmax(140px,1.4fr)_repeat(7,minmax(64px,1fr))] border-b border-[#E5E7EB] text-center text-sm last:border-b-0"
                key={routine.name}
              >
                <div className="truncate px-3 py-3 text-left font-semibold text-[#1F2F5C]">{routine.name}</div>
                {routine.days.map((day) => {
                  const completed = getRoutineCompletionState(
                    routineCompletionOverrides,
                    routine.name,
                    day.key,
                    day.completed,
                  );

                  return (
                    <div className={`px-2 py-3 ${day.isToday ? "bg-[#F8FAFC]" : ""}`} key={`${routine.name}-${day.key}`}>
                      <button
                        aria-label={`${routine.name} ${day.label}요일 ${completed ? "완료" : "미완료"}`}
                        aria-pressed={completed}
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold transition hover:border-[#0B1F4D] focus:outline-none focus:ring-2 focus:ring-[#0B1F4D] focus:ring-offset-2 ${
                          completed
                            ? "border-[#0B1F4D] bg-[#0B1F4D] text-white"
                            : "border-[#CBD5E1] bg-white text-[#CBD5E1]"
                        }`}
                        onClick={() => handleRoutineCheckToggle(routine.name, day.key, day.completed)}
                        type="button"
                      >
                        {completed ? "✓" : ""}
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 text-xs text-[#98A2B3]">
          체크 상태는 현재 화면에서 즉시 반영되며, 별도 저장 구조가 없어 새로고침 후에는 기존 시간 기록 기준으로 다시 표시됩니다.
        </p>
      </Card>
    </div>
  );
}

export function buildWeeklyRoutineGrid(
  routines: RoutineDefinition[],
  weekLogs: TimeLog[],
  weekDays: KstWeekDay[],
): WeeklyRoutineGridItem[] {
  return routines.map((routine) => ({
    ...routine,
    days: weekDays.map((day) => ({
      ...day,
      completed: isRoutineCompleted(routine, weekLogs, day.key),
    })),
  }));
}

export function getRoutineCompletionState(
  completions: RoutineCompletionMap,
  routineName: string,
  dateKey: string,
  fallbackCompleted: boolean,
) {
  return completions[getRoutineCompletionKey(routineName, dateKey)] ?? fallbackCompleted;
}

function buildMonthDays(timeLogs: TimeLog[]): CalendarDay[] {
  const logsByDate = groupLogsByDate(timeLogs);

  return getKstMonthCalendarDays().map((day) => ({
    ...day,
    logs: day.key ? (logsByDate.get(day.key) ?? []) : [],
  }));
}

function groupLogsByDate(timeLogs: TimeLog[]) {
  return timeLogs.reduce<Map<string, TimeLog[]>>((result, timeLog) => {
    const current = result.get(timeLog.log_date) ?? [];
    current.push(timeLog);
    current.sort((first, second) => first.start_time.localeCompare(second.start_time));
    result.set(timeLog.log_date, current);

    return result;
  }, new Map());
}

function isRoutineCompleted(routine: RoutineDefinition, weekLogs: TimeLog[], dateKey: string) {
  return weekLogs.some((timeLog) => {
    if (timeLog.log_date !== dateKey) {
      return false;
    }

    const activity = timeLog.activity.toLowerCase();
    const label = getTimeLogCategoryLabel(timeLog.category);

    return (
      routine.categories.includes(timeLog.category) ||
      routine.keywords.some((keyword) => activity.includes(keyword.toLowerCase())) ||
      routine.keywords.some((keyword) => label.includes(keyword))
    );
  });
}

function getRoutineCompletionKey(routineName: string, dateKey: string) {
  return `${routineName}:${dateKey}`;
}
