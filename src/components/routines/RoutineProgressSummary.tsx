"use client";

import { FormEvent, useMemo, useState } from "react";
import { Card } from "@/components/common/Card";
import {
  getKstDateParts,
  getKstMonthCalendarDays,
  getKstWeekRange,
  kstWeekdayLabels,
  type KstWeekDay,
} from "@/lib/dates";
import {
  buildRoutineCompletionMap,
  getRoutineCompletionKey,
  setRoutineCompletion,
} from "@/lib/routines/routineCompletions";
import {
  archiveRoutine,
  buildRoutineFormValues,
  createRoutine,
  updateRoutine,
  type RoutineFormPayload,
} from "@/lib/routines/routines";
import { createClient } from "@/lib/supabase/browser";
import type { Routine, RoutineCompletion, TimeLog } from "@/types";

type RoutineProgressSummaryProps = {
  timeLogs: TimeLog[];
  userId: string;
  initialRoutines: Routine[];
  initialRoutineCompletions: RoutineCompletion[];
};

type CalendarDay = {
  key: string;
  dayOfMonth: number;
  isToday: boolean;
  logs: TimeLog[];
};

type WeeklyRoutineGridItem = Routine & {
  days: Array<KstWeekDay & { completed: boolean }>;
};

export function RoutineProgressSummary({
  timeLogs,
  userId,
  initialRoutines,
  initialRoutineCompletions,
}: RoutineProgressSummaryProps) {
  const { year, month } = getKstDateParts();
  const supabase = useMemo(() => createClient(), []);
  const [routines, setRoutines] = useState(initialRoutines);
  const [completionMap, setCompletionMap] = useState(() => buildRoutineCompletionMap(initialRoutineCompletions));
  const [isFormOpen, setIsFormOpen] = useState(initialRoutines.length === 0);
  const [editingRoutineId, setEditingRoutineId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<RoutineFormPayload>(() => buildRoutineFormValues());
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const monthDays = useMemo(() => buildMonthDays(timeLogs), [timeLogs]);
  const monthLogs = monthDays.flatMap((day) => day.logs);
  const weekDays = useMemo(() => getKstWeekRange().days, []);
  const weeklyRoutineGrid = useMemo(
    () => buildWeeklyRoutineGrid(routines, completionMap, weekDays),
    [routines, completionMap, weekDays],
  );
  const editingRoutine = editingRoutineId ? routines.find((routine) => routine.id === editingRoutineId) : null;

  function openCreateForm() {
    setEditingRoutineId(null);
    setFormValues(buildRoutineFormValues());
    setActionError("");
    setIsFormOpen(true);
  }

  function openEditForm(routine: Routine) {
    setEditingRoutineId(routine.id);
    setFormValues(buildRoutineFormValues(routine));
    setActionError("");
    setIsFormOpen(true);
  }

  function closeForm() {
    setEditingRoutineId(null);
    setFormValues(buildRoutineFormValues());
    setActionError("");
    setIsFormOpen(false);
  }

  async function handleRoutineSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setActionError("");

    try {
      const result = editingRoutineId
        ? await updateRoutine(supabase, userId, editingRoutineId, formValues)
        : await createRoutine(supabase, userId, formValues);

      if (result.error) {
        setActionError(result.error.message);
        return;
      }

      if (result.data) {
        setRoutines((current) =>
          editingRoutineId
            ? current.map((routine) => (routine.id === result.data.id ? result.data : routine))
            : [...current, result.data],
        );
      }

      closeForm();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "루틴을 저장하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function handleArchiveRoutine(routine: Routine) {
    const confirmed = window.confirm(
      "이 루틴을 삭제할까요? 기존 체크 기록은 보존되지만 화면에서는 더 이상 표시되지 않습니다.",
    );

    if (!confirmed) {
      return;
    }

    setActionError("");
    const result = await archiveRoutine(supabase, userId, routine.id);

    if (result.error) {
      setActionError(result.error.message);
      return;
    }

    setRoutines((current) => current.filter((item) => item.id !== routine.id));
    if (editingRoutineId === routine.id) {
      closeForm();
    }
  }

  async function handleRoutineCheckToggle(routineId: string, dateKey: string, completed: boolean) {
    const key = getRoutineCompletionKey(routineId, dateKey);
    const nextCompleted = !completed;

    setCompletionMap((current) => ({
      ...current,
      [key]: nextCompleted,
    }));

    const result = await setRoutineCompletion({
      client: supabase,
      userId,
      routineId,
      completionDate: dateKey,
      completed: nextCompleted,
    });

    if (result.error) {
      setCompletionMap((current) => ({
        ...current,
        [key]: completed,
      }));
      setActionError(result.error.message);
    }
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#1F2F5C]">이번 주 루틴 현황</h2>
            <p className="mt-1 text-sm text-[#6B7280]">반복 행동을 월요일부터 일요일까지 체크합니다.</p>
          </div>
          <button
            className="w-fit rounded-xl bg-[#0B1F4D] px-4 py-2 text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(11,31,77,0.18)]"
            onClick={openCreateForm}
            type="button"
          >
            + 루틴 추가
          </button>
        </div>

        {actionError ? <p className="mt-3 text-sm font-semibold text-[#C92735]">{actionError}</p> : null}

        {isFormOpen ? (
          <form
            className="mt-4 rounded-xl border border-[#D8E2F6] bg-[#F8FAFC] p-4"
            onSubmit={handleRoutineSubmit}
          >
            <div className="grid gap-3 sm:grid-cols-[1fr_1fr]">
              <label className="text-sm font-bold text-[#1F2F5C]">
                루틴명
                <input
                  className="mt-2 w-full rounded-lg border border-[#CBD5E1] px-3 py-2 text-sm text-[#111827] outline-none focus:border-[#0B1F4D] focus:ring-2 focus:ring-[#D8E2F6]"
                  onChange={(event) => setFormValues((current) => ({ ...current, title: event.target.value }))}
                  placeholder="예: 알고리즘 1문제 풀기"
                  required
                  value={formValues.title}
                />
              </label>
              <label className="text-sm font-bold text-[#1F2F5C]">
                카테고리
                <input
                  className="mt-2 w-full rounded-lg border border-[#CBD5E1] px-3 py-2 text-sm text-[#111827] outline-none focus:border-[#0B1F4D] focus:ring-2 focus:ring-[#D8E2F6]"
                  onChange={(event) => setFormValues((current) => ({ ...current, category: event.target.value }))}
                  placeholder="예: 학습, 건강, 업무"
                  value={formValues.category ?? ""}
                />
              </label>
            </div>
            <label className="mt-3 block text-sm font-bold text-[#1F2F5C]">
              설명
              <textarea
                className="mt-2 min-h-20 w-full rounded-lg border border-[#CBD5E1] px-3 py-2 text-sm text-[#111827] outline-none focus:border-[#0B1F4D] focus:ring-2 focus:ring-[#D8E2F6]"
                onChange={(event) => setFormValues((current) => ({ ...current, description: event.target.value }))}
                placeholder="반복하려는 행동을 간단히 적어두세요."
                value={formValues.description ?? ""}
              />
            </label>
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button
                className="rounded-lg border border-[#CBD5E1] bg-white px-4 py-2 text-sm font-bold text-[#374151]"
                disabled={saving}
                onClick={closeForm}
                type="button"
              >
                취소
              </button>
              <button
                className="rounded-lg bg-[#0B1F4D] px-4 py-2 text-sm font-extrabold text-white disabled:opacity-60"
                disabled={saving}
                type="submit"
              >
                {saving ? "저장 중" : editingRoutine ? "수정 완료" : "추가"}
              </button>
            </div>
          </form>
        ) : null}

        {routines.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-6 text-center">
            <h3 className="font-bold text-[#1F2F5C]">아직 등록된 루틴이 없습니다.</h3>
            <p className="mt-2 text-sm text-[#6B7280]">
              반복하고 싶은 행동을 직접 추가해 이번 주 루틴 체크보드를 만들어보세요.
            </p>
            <button
              className="mt-4 rounded-xl bg-[#0B1F4D] px-4 py-2 text-sm font-extrabold text-white"
              onClick={openCreateForm}
              type="button"
            >
              + 첫 루틴 추가하기
            </button>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <div className="min-w-[720px] rounded-xl border border-[#E5E7EB]">
              <div className="grid grid-cols-[minmax(180px,1.5fr)_repeat(7,minmax(64px,1fr))] border-b border-[#E5E7EB] bg-[#F8FAFC] text-center text-xs font-bold text-[#667085]">
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
                  className="grid grid-cols-[minmax(180px,1.5fr)_repeat(7,minmax(64px,1fr))] border-b border-[#E5E7EB] text-center text-sm last:border-b-0"
                  key={routine.id}
                >
                  <div className="min-w-0 px-3 py-3 text-left">
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-semibold text-[#1F2F5C]">{routine.title}</div>
                        {routine.category || routine.description ? (
                          <div className="mt-1 truncate text-xs font-medium text-[#667085]">
                            {[routine.category, routine.description].filter(Boolean).join(" · ")}
                          </div>
                        ) : null}
                      </div>
                      <button
                        className="shrink-0 rounded-md border border-[#CBD5E1] px-2 py-1 text-xs font-bold text-[#374151]"
                        onClick={() => openEditForm(routine)}
                        type="button"
                      >
                        수정
                      </button>
                      <button
                        className="shrink-0 rounded-md border border-[#F2B8BE] px-2 py-1 text-xs font-bold text-[#C92735]"
                        onClick={() => handleArchiveRoutine(routine)}
                        type="button"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  {routine.days.map((day) => (
                    <div className={`px-2 py-3 ${day.isToday ? "bg-[#F8FAFC]" : ""}`} key={`${routine.id}-${day.key}`}>
                      <button
                        aria-label={`${routine.title} ${day.label}요일 ${day.completed ? "완료" : "미완료"}`}
                        aria-pressed={day.completed}
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold transition hover:border-[#0B1F4D] focus:outline-none focus:ring-2 focus:ring-[#0B1F4D] focus:ring-offset-2 ${
                          day.completed
                            ? "border-[#0B1F4D] bg-[#0B1F4D] text-white"
                            : "border-[#CBD5E1] bg-white text-[#CBD5E1]"
                        }`}
                        onClick={() => handleRoutineCheckToggle(routine.id, day.key, day.completed)}
                        type="button"
                      >
                        {day.completed ? "✓" : ""}
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export function buildWeeklyRoutineGrid(
  routines: Routine[],
  completionMap: Record<string, boolean>,
  weekDays: KstWeekDay[],
): WeeklyRoutineGridItem[] {
  return routines.map((routine) => ({
    ...routine,
    days: weekDays.map((day) => ({
      ...day,
      completed: completionMap[getRoutineCompletionKey(routine.id, day.key)] ?? false,
    })),
  }));
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
