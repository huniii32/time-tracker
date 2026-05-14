"use client";

import { FormEvent, useMemo, useState } from "react";
import { AppInput, AppTextarea, DashboardCard, EmptyState, GhostButton, Pill, PrimaryButton } from "@/components/common/ui";
import { getKstDateParts, getKstMonthCalendarDays, getKstWeekRange, kstWeekdayLabels, type KstWeekDay } from "@/lib/dates";
import { buildRoutineCompletionMap, getRoutineCompletionKey, setRoutineCompletion } from "@/lib/routines/routineCompletions";
import { archiveRoutine, buildRoutineFormValues, createRoutine, updateRoutine, type RoutineFormPayload } from "@/lib/routines/routines";
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
    const confirmed = window.confirm("이 루틴을 삭제할까요? 기존 체크 기록은 보존됩니다.");

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

    setCompletionMap((current) => ({ ...current, [key]: nextCompleted }));

    const result = await setRoutineCompletion({
      client: supabase,
      userId,
      routineId,
      completionDate: dateKey,
      completed: nextCompleted,
    });

    if (result.error) {
      setCompletionMap((current) => ({ ...current, [key]: completed }));
      setActionError(result.error.message);
    }
  }

  return (
    <div className="space-y-4">
      <DashboardCard>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[#0c0a09]">월간 캘린더</h2>
            <p className="mt-1 text-sm text-[#78716c]">{year}년 {month}월 시간 기록</p>
          </div>
          <Pill>기록 {monthLogs.length}개</Pill>
        </div>

        {monthLogs.length === 0 ? <div className="mt-4"><EmptyState title="아직 이번 달 시간 기록이 없습니다." /></div> : null}

        <div className="mt-4 overflow-x-auto">
          <div className="min-w-[620px]">
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-[#78716c]">
              {kstWeekdayLabels.map((weekday) => <div className="py-2" key={weekday}>{weekday}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {monthDays.map((day, index) => day.key ? (
                <div
                  className={`min-h-28 rounded-[10px] border px-2 py-2 text-sm ${day.isToday ? "border-[#3ba6f1] bg-[#fafaf9] text-[#0c0a09]" : day.logs.length > 0 ? "border-[#c1e1f7] bg-white text-[#0c0a09]" : "border-[#e5e7eb] bg-white text-[#78716c]"}`}
                  key={day.key}
                >
                  <div className="font-semibold">{day.dayOfMonth}</div>
                  <div className="mt-2 space-y-1">
                    {day.logs.slice(0, 2).map((timeLog) => (
                      <div className="truncate rounded-md border border-[#e5e7eb] bg-white px-2 py-1 text-[11px] font-medium text-[#0c0a09]" key={timeLog.id} title={timeLog.activity}>
                        {timeLog.activity}
                      </div>
                    ))}
                    {day.logs.length > 2 ? <div className="text-[11px] font-medium text-[#78716c]">+{day.logs.length - 2}개</div> : null}
                  </div>
                </div>
              ) : <div className="min-h-28" key={`empty-${index}`} />)}
            </div>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#0c0a09]">이번 주 루틴 현황</h2>
            <p className="mt-1 text-sm text-[#78716c]">반복 행동을 월요일부터 일요일까지 체크합니다.</p>
          </div>
          <button onClick={openCreateForm} type="button"><PrimaryButton>루틴 추가</PrimaryButton></button>
        </div>

        {actionError ? <p className="mt-3 text-sm font-medium text-[#78716c]">{actionError}</p> : null}

        {isFormOpen ? (
          <form className="mt-4 rounded-[10px] border border-[#e5e7eb] bg-[#fafaf9] p-4" onSubmit={handleRoutineSubmit}>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-medium text-[#0c0a09]">
                루틴명
                <AppInput className="mt-2" onChange={(event) => setFormValues((current) => ({ ...current, title: event.target.value }))} placeholder="예: 알고리즘 1문제 풀기" required value={formValues.title} />
              </label>
              <label className="text-sm font-medium text-[#0c0a09]">
                카테고리
                <AppInput className="mt-2" onChange={(event) => setFormValues((current) => ({ ...current, category: event.target.value }))} placeholder="예: 학습, 건강, 업무" value={formValues.category ?? ""} />
              </label>
            </div>
            <label className="mt-3 block text-sm font-medium text-[#0c0a09]">
              설명
              <AppTextarea className="mt-2 min-h-20" onChange={(event) => setFormValues((current) => ({ ...current, description: event.target.value }))} placeholder="반복하려는 행동을 간단히 적어주세요." value={formValues.description ?? ""} />
            </label>
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button disabled={saving} onClick={closeForm} type="button"><GhostButton>취소</GhostButton></button>
              <button disabled={saving} type="submit"><PrimaryButton>{saving ? "저장 중" : editingRoutine ? "수정 완료" : "추가"}</PrimaryButton></button>
            </div>
          </form>
        ) : null}

        {routines.length === 0 ? (
          <div className="mt-4">
            <EmptyState action={<button onClick={openCreateForm} type="button"><PrimaryButton>첫 루틴 추가</PrimaryButton></button>} description="반복하고 싶은 행동을 추가해 이번 주 루틴 체크보드를 만들어보세요." title="아직 등록된 루틴이 없습니다." />
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <div className="min-w-[720px] rounded-[10px] border border-[#e5e7eb] bg-white">
              <div className="grid grid-cols-[minmax(180px,1.5fr)_repeat(7,minmax(64px,1fr))] border-b border-[#e5e7eb] bg-[#fafaf9] text-center text-xs font-medium text-[#78716c]">
                <div className="px-3 py-3 text-left">루틴</div>
                {weekDays.map((day) => <div className={`px-2 py-3 ${day.isToday ? "bg-[#c1e1f7] text-[#0c0a09]" : ""}`} key={day.key}><span>{day.label}</span><span className="mt-1 block text-[#78716c]">{day.dayOfMonth}</span></div>)}
              </div>
              {weeklyRoutineGrid.map((routine) => (
                <div className="grid grid-cols-[minmax(180px,1.5fr)_repeat(7,minmax(64px,1fr))] border-b border-[#e5e7eb] text-center text-sm last:border-b-0" key={routine.id}>
                  <div className="min-w-0 px-3 py-3 text-left">
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium text-[#0c0a09]">{routine.title}</div>
                        {routine.category || routine.description ? <div className="mt-1 truncate text-xs font-medium text-[#78716c]">{[routine.category, routine.description].filter(Boolean).join(" · ")}</div> : null}
                      </div>
                      <button onClick={() => openEditForm(routine)} type="button"><GhostButton className="min-h-8 px-3 py-1 text-xs">수정</GhostButton></button>
                      <button onClick={() => handleArchiveRoutine(routine)} type="button"><GhostButton className="min-h-8 px-3 py-1 text-xs">삭제</GhostButton></button>
                    </div>
                  </div>
                  {routine.days.map((day) => (
                    <div className={`px-2 py-3 ${day.isToday ? "bg-[#fafaf9]" : ""}`} key={`${routine.id}-${day.key}`}>
                      <button
                        aria-label={`${routine.title} ${day.label}요일 ${day.completed ? "완료" : "미완료"}`}
                        aria-pressed={day.completed}
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition hover:border-[#3ba6f1] focus:outline-none focus:ring-2 focus:ring-[#c1e1f7] focus:ring-offset-2 ${day.completed ? "border-[#3ba6f1] bg-[#3ba6f1] text-white" : "border-[#d6d3d1] bg-white text-[#a8a29e]"}`}
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
      </DashboardCard>
    </div>
  );
}

export function buildWeeklyRoutineGrid(routines: Routine[], completionMap: Record<string, boolean>, weekDays: KstWeekDay[]): WeeklyRoutineGridItem[] {
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