"use client";

import { Card } from "@/components/common/Card";
import type { TimeLog } from "@/types";

type RoutineProgressSummaryProps = {
  timeLogs: TimeLog[];
};

type CalendarDay = {
  date: Date;
  key: string;
  dayOfMonth: number;
  isToday: boolean;
  hasLog: boolean;
};

const weekdayLabels = ["월", "화", "수", "목", "금", "토", "일"];

export function RoutineProgressSummary({ timeLogs }: RoutineProgressSummaryProps) {
  const today = new Date();
  const todayKey = formatDateKey(today);
  const monthDays = buildMonthDays(today, timeLogs, todayKey);
  const monthLogCount = monthDays.filter((day) => day.hasLog).length;
  const weekDays = buildWeekDays(today);
  const weekDayKeys = new Set(weekDays.map((day) => day.key));
  const weekLogs = timeLogs.filter((timeLog) => weekDayKeys.has(timeLog.log_date));
  const activityNames = Array.from(new Set(weekLogs.map((timeLog) => timeLog.activity))).sort();

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#1F2F5C]">월간 캘린더</h2>
            <p className="mt-1 text-sm text-[#6B7280]">
              {today.getFullYear()}년 {today.getMonth() + 1}월 루틴 기록
            </p>
          </div>
          <span className="rounded-lg bg-[#EEF4FF] px-3 py-1 text-xs font-bold text-[#1F2F5C]">
            완료 {monthLogCount}일
          </span>
        </div>

        {monthLogCount === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-6 text-center text-sm text-[#6B7280]">
            아직 이번 달 루틴 기록이 없습니다.
          </div>
        ) : null}

        <div className="mt-4 overflow-x-auto">
          <div className="min-w-[420px]">
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-[#667085]">
              {weekdayLabels.map((weekday) => (
                <div className="py-2" key={weekday}>
                  {weekday}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {monthDays.map((day, index) =>
                day.key ? (
                  <div
                    className={`min-h-14 rounded-lg border px-2 py-2 text-sm ${
                      day.isToday
                        ? "border-[#0B1F4D] bg-[#EEF4FF] font-extrabold text-[#0B1F4D]"
                        : "border-[#E5E7EB] bg-white text-[#374151]"
                    }`}
                    key={day.key}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span>{day.dayOfMonth}</span>
                      {day.hasLog ? (
                        <span className="rounded-full bg-[#0B1F4D] px-1.5 py-0.5 text-[10px] font-bold text-white">
                          완료
                        </span>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div className="min-h-14" key={`empty-${index}`} />
                ),
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-bold text-[#1F2F5C]">이번 주 루틴 현황</h2>
        <p className="mt-1 text-sm text-[#6B7280]">월~일 기준 완료 여부를 확인합니다.</p>

        {weekLogs.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-6 text-center text-sm text-[#6B7280]">
            아직 이번 주 루틴 기록이 없습니다.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <div className="min-w-[560px] rounded-xl border border-[#E5E7EB]">
              <div className="grid grid-cols-[minmax(140px,1.4fr)_repeat(7,minmax(56px,1fr))] border-b border-[#E5E7EB] bg-[#F8FAFC] text-center text-xs font-bold text-[#667085]">
                <div className="px-3 py-3 text-left">루틴</div>
                {weekDays.map((day) => (
                  <div className="px-2 py-3" key={day.key}>
                    <span>{day.label}</span>
                    <span className="mt-1 block font-semibold text-[#98A2B3]">{day.dayOfMonth}</span>
                  </div>
                ))}
              </div>
              {activityNames.map((activityName) => (
                <div
                  className="grid grid-cols-[minmax(140px,1.4fr)_repeat(7,minmax(56px,1fr))] border-b border-[#E5E7EB] text-center text-sm last:border-b-0"
                  key={activityName}
                >
                  <div className="truncate px-3 py-3 text-left font-semibold text-[#1F2F5C]">
                    {activityName}
                  </div>
                  {weekDays.map((day) => {
                    const completed = weekLogs.some(
                      (timeLog) =>
                        timeLog.activity === activityName && timeLog.log_date === day.key,
                    );

                    return (
                      <div className="px-2 py-3" key={`${activityName}-${day.key}`}>
                        <span
                          aria-label={completed ? "완료" : "미완료"}
                          className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold ${
                            completed
                              ? "border-[#0B1F4D] bg-[#0B1F4D] text-white"
                              : "border-[#CBD5E1] bg-white text-[#CBD5E1]"
                          }`}
                        >
                          {completed ? "✓" : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function buildMonthDays(today: Date, timeLogs: TimeLog[], todayKey: string): CalendarDay[] {
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDate = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0);
  const leadingEmptyDays = (firstDate.getDay() + 6) % 7;
  const loggedDates = new Set(timeLogs.map((timeLog) => timeLog.log_date));
  const days: CalendarDay[] = Array.from({ length: leadingEmptyDays }, () => ({
    date: new Date(NaN),
    key: "",
    dayOfMonth: 0,
    isToday: false,
    hasLog: false,
  }));

  for (let day = 1; day <= lastDate.getDate(); day += 1) {
    const date = new Date(year, month, day);
    const key = formatDateKey(date);

    days.push({
      date,
      key,
      dayOfMonth: day,
      isToday: key === todayKey,
      hasLog: loggedDates.has(key),
    });
  }

  return days;
}

function buildWeekDays(today: Date) {
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

  return weekdayLabels.map((label, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);

    return {
      label,
      key: formatDateKey(date),
      dayOfMonth: date.getDate(),
    };
  });
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
