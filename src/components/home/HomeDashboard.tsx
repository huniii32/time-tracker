"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DashboardCard, EmptyState, MetricCard, Pill } from "@/components/common/ui";
import { getActiveTasks, getAverageGoalProgress, getDaysSince, getDueSoonTasks, getLatestEmotionNote, getTodayDate, getWeeklyTimeLogs, sumTimeLogHours } from "@/lib/home/dashboard";
import { listGoals } from "@/lib/queries/goals";
import { listMeetings } from "@/lib/queries/meetings";
import { listNotes } from "@/lib/queries/notes";
import { getProfile } from "@/lib/queries/profiles";
import { listReflections } from "@/lib/queries/reflections";
import { getUserSettings } from "@/lib/queries/settings";
import { listTasks } from "@/lib/queries/tasks";
import { listTimeLogs } from "@/lib/queries/timeLogs";
import { createClient } from "@/lib/supabase/browser";
import type { Goal, Meeting, Note, Profile, Reflection, Task, TimeLog, UserSettings } from "@/types";

type DashboardData = {
  profile: Profile | null;
  notes: Note[];
  tasks: Task[];
  meetings: Meeting[];
  timeLogs: TimeLog[];
  goals: Goal[];
  reflections: Reflection[];
  settings: UserSettings | null;
};

export function HomeDashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const [
        profileResult,
        settingsResult,
        notesResult,
        tasksResult,
        meetingsResult,
        timeLogsResult,
        goalsResult,
        reflectionsResult,
      ] = await Promise.all([
        getProfile(supabase, user.id),
        getUserSettings(supabase, user.id),
        listNotes(supabase, user.id),
        listTasks(supabase, user.id),
        listMeetings(supabase, user.id),
        listTimeLogs(supabase, user.id),
        listGoals(supabase, user.id),
        listReflections(supabase, user.id),
      ]);

      const firstError =
        profileResult.error ||
        notesResult.error ||
        tasksResult.error ||
        meetingsResult.error ||
        timeLogsResult.error ||
        goalsResult.error ||
        reflectionsResult.error;

      if (firstError) {
        setError(firstError.message);
      }

      setData({
        profile: profileResult.data ?? null,
        settings: settingsResult.data ?? null,
        notes: notesResult.data ?? [],
        tasks: tasksResult.data ?? [],
        meetings: meetingsResult.data ?? [],
        timeLogs: timeLogsResult.data ?? [],
        goals: goalsResult.data ?? [],
        reflections: reflectionsResult.data ?? [],
      });
      setLoading(false);
    }

    void loadDashboard();
  }, [router]);

  const summary = useMemo(() => {
    if (!data) {
      return null;
    }

    const settings = data.settings;
    const weeklyTimeLogs = getWeeklyTimeLogs(data.timeLogs, settings?.week_starts_on ?? "monday");
    const todayTime = data.timeLogs.filter((timeLog) => timeLog.log_date === getTodayDate());
    const activeTasks = getActiveTasks(data.tasks);
    const dueSoonTasks = getDueSoonTasks(data.tasks);
    const todayHours =
      sumTimeLogHours(todayTime, ["company_work"]) +
      sumTimeLogHours(todayTime, ["coding_study"]) +
      sumTimeLogHours(todayTime, ["paper_review"]) +
      sumTimeLogHours(todayTime, ["onboarding_log"]) +
      sumTimeLogHours(todayTime, ["other"]);
    const weeklyTotalHours =
      sumTimeLogHours(weeklyTimeLogs, ["company_work"]) +
      sumTimeLogHours(weeklyTimeLogs, ["coding_study"]) +
      sumTimeLogHours(weeklyTimeLogs, ["paper_review"]) +
      sumTimeLogHours(weeklyTimeLogs, ["onboarding_log"]) +
      sumTimeLogHours(weeklyTimeLogs, ["other"]);

    return {
      today: getTodayDate(),
      displayName: settings?.display_name ?? data.profile?.name ?? "",
      dDay: getDaysSince(settings?.joined_at ?? data.profile?.start_date),
      recentNotes: data.notes.slice(0, 3),
      activeTasks: activeTasks.slice(0, 4),
      dueSoonTasks,
      recentMeetings: data.meetings.slice(0, 3),
      weeklyTimeLogs,
      todayHours,
      dailyTargetHours: settings?.daily_target_hours ?? 8,
      weeklyTargetHours: settings?.weekly_target_hours ?? 40,
      weeklyTotalHours,
      codingHours: sumTimeLogHours(weeklyTimeLogs, ["coding_study"]),
      paperHours: sumTimeLogHours(weeklyTimeLogs, ["paper_review"]),
      workHours: sumTimeLogHours(weeklyTimeLogs, ["company_work"]),
      averageGoalProgress: getAverageGoalProgress(data.goals),
      recentReflection: data.reflections[0],
      emotionNote: getLatestEmotionNote(data.notes),
    };
  }, [data]);

  if (loading) {
    return <DashboardCard>Time Tracker 대시보드를 불러오는 중입니다.</DashboardCard>;
  }

  if (!summary) {
    return (
      <DashboardCard>
        <EmptyState description={error || "잠시 후 다시 시도해주세요."} title="대시보드 데이터를 불러오지 못했습니다." />
      </DashboardCard>
    );
  }

  return (
    <div className="space-y-5">
      {error ? <p className="rounded-[10px] border border-[#e5e7eb] bg-white p-4 text-sm text-[#78716c]">{error}</p> : null}

      <DashboardCard className="rounded-2xl">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-medium text-[#78716c]">Time Tracker Web</p>
            <h2 className="mt-2 text-2xl font-medium leading-tight text-[#0c0a09] sm:text-[32px]">
              안녕하세요{summary.displayName ? `, ${summary.displayName}` : ""}.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#78716c]">
              오늘의 업무, 시간 기록, 회고 상태를 한 화면에서 확인합니다.
            </p>
          </div>
          <Pill>{summary.today} · {summary.dDay ? `D+${summary.dDay}` : "입사일 미설정"}</Pill>
        </div>
      </DashboardCard>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="입사 경과" value={summary.dDay ? `D+${summary.dDay}` : "--"} />
        <MetricCard detail={`목표 ${summary.dailyTargetHours}h`} label="오늘 기록 시간" value={`${summary.todayHours}h`} />
        <MetricCard label="진행 중 업무" value={`${summary.activeTasks.length}건`} />
        <MetricCard label="목표 평균" value={summary.averageGoalProgress === null ? "--" : `${summary.averageGoalProgress}%`} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <DashboardCard>
          <SectionHeader href="/notes" title="최근 노트" />
          {summary.recentNotes.length === 0 ? (
            <EmptyState description="배운 내용이나 업무 맥락을 노트로 남겨보세요." title="아직 노트가 없습니다." />
          ) : (
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {summary.recentNotes.map((note) => (
                <Link className="block rounded-[10px] border border-[#e5e7eb] p-4 transition hover:border-[#d6d3d1]" href={`/notes/${note.id}`} key={note.id}>
                  <p className="font-semibold text-[#0c0a09]">{note.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#78716c]">{note.content}</p>
                </Link>
              ))}
            </div>
          )}
        </DashboardCard>

        <DashboardCard>
          <SectionHeader href="/tasks" title="업무 요약" />
          {summary.activeTasks.length === 0 ? (
            <EmptyState title="진행 중인 업무가 없습니다." />
          ) : (
            <div className="space-y-3">
              {summary.activeTasks.map((task) => (
                <Link className="block rounded-[10px] border border-[#e5e7eb] bg-[#fafaf9] p-4" href={`/tasks/${task.id}`} key={task.id}>
                  <p className="font-medium text-[#0c0a09]">{task.title}</p>
                  <p className="mt-1 text-sm text-[#78716c]">마감 {task.due_date ?? "-"}</p>
                </Link>
              ))}
            </div>
          )}
          {summary.dueSoonTasks.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {summary.dueSoonTasks.map((task) => (
                <Link href={`/tasks/${task.id}`} key={task.id}>
                  <Pill>{task.title} · {task.due_date}</Pill>
                </Link>
              ))}
            </div>
          ) : null}
        </DashboardCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <DashboardCard>
          <SectionHeader href="/routines" title="이번 주 시간" />
          <p className="text-2xl font-semibold text-[#0c0a09]">
            {summary.weeklyTotalHours}h / {summary.weeklyTargetHours}h
          </p>
          <div className="mt-5 space-y-3">
            {[
              ["코딩 공부", summary.codingHours],
              ["논문 리뷰", summary.paperHours],
              ["업무", summary.workHours],
            ].map(([label, value]) => (
              <div key={label as string}>
                <div className="mb-1 flex justify-between text-sm font-medium text-[#0c0a09]">
                  <span>{label}</span>
                  <span>{value}h</span>
                </div>
                <div className="h-2 rounded-full bg-[#e5e7eb]">
                  <div className="h-2 rounded-full bg-[#3ba6f1]" style={{ width: `${Math.min(100, Number(value) * 10)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard>
          <SectionHeader href="/reflections" title="최근 회고" />
          {!summary.recentReflection ? (
            <EmptyState title="아직 회고가 없습니다." />
          ) : (
            <Link className="block" href={`/reflections/${summary.recentReflection.id}`}>
              <p className="text-sm font-medium text-[#78716c]">{summary.recentReflection.reflection_date}</p>
              <p className="mt-2 line-clamp-3 font-medium leading-6 text-[#0c0a09]">{summary.recentReflection.learned}</p>
              {summary.recentReflection.tomorrow_action ? (
                <p className="mt-3 rounded-[10px] border border-[#e5e7eb] bg-[#fafaf9] p-3 text-sm leading-6 text-[#78716c]">
                  내일 행동: {summary.recentReflection.tomorrow_action}
                </p>
              ) : null}
            </Link>
          )}
        </DashboardCard>

        <DashboardCard>
          <SectionHeader href="/meetings" title="최근 미팅" />
          {summary.recentMeetings.length === 0 ? (
            <EmptyState title="아직 미팅 기록이 없습니다." />
          ) : (
            <div className="space-y-3">
              {summary.recentMeetings.map((meeting) => (
                <Link className="block rounded-[10px] border border-[#e5e7eb] p-3 hover:border-[#d6d3d1]" href={`/meetings/${meeting.id}`} key={meeting.id}>
                  <p className="font-medium text-[#0c0a09]">{meeting.title}</p>
                  <p className="mt-1 text-sm text-[#78716c]">{meeting.meeting_date}</p>
                </Link>
              ))}
            </div>
          )}
        </DashboardCard>
      </div>
    </div>
  );
}

function SectionHeader({ href, title }: { href: string; title: string }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-lg font-semibold text-[#0c0a09]">{title}</h2>
      <Link className="text-sm font-medium text-[#3ba6f1]" href={href}>
        보기
      </Link>
    </div>
  );
}
