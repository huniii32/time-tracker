"use client";

import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/common/Card";
import { listGoals } from "@/lib/queries/goals";
import { listMeetings } from "@/lib/queries/meetings";
import { listNotes } from "@/lib/queries/notes";
import { getProfile } from "@/lib/queries/profiles";
import { listReflections } from "@/lib/queries/reflections";
import { getUserSettings } from "@/lib/queries/settings";
import { listTasks } from "@/lib/queries/tasks";
import { listTimeLogs } from "@/lib/queries/timeLogs";
import {
  getActiveTasks,
  getAverageGoalProgress,
  getDaysSince,
  getDueSoonTasks,
  getEmotionSummary,
  getLatestEmotionNote,
  getTodayDate,
  getWeeklyTimeLogs,
  sumTimeLogHours,
} from "@/lib/home/dashboard";
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

type IconProps = SVGProps<SVGSVGElement>;

function CalendarDays(props: IconProps) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect height="18" rx="2" width="18" x="3" y="4" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}

function Clock3(props: IconProps) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6h4" />
    </svg>
  );
}

function CheckSquare(props: IconProps) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="m9 11 3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function Target(props: IconProps) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function EmptyText({ children }: { children: string }) {
  return <p className="rounded-2xl bg-[#F5F7FB] p-4 text-sm leading-6 text-[#667085]">{children}</p>;
}

function SectionHeader({ href, title }: { href: string; title: string }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="font-extrabold text-[#0B1F4D]">{title}</h2>
      <Link className="rounded-full bg-[#F5F7FB] px-3 py-1.5 text-xs font-extrabold text-[#0B1F4D]" href={href}>
        보기
      </Link>
    </div>
  );
}

function SummaryCard({
  icon,
  iconBgClass,
  iconClass,
  label,
  value,
  href,
}: {
  icon: ComponentType<IconProps>;
  iconBgClass: string;
  iconClass: string;
  label: string;
  value: string;
  href?: string;
}) {
  const Icon = icon;

  const content = (
    <Card className="h-full">
      <div className={`mb-5 flex h-10 w-10 items-center justify-center rounded-2xl ${iconBgClass}`}>
        <Icon aria-hidden="true" className={`h-5 w-5 ${iconClass}`} />
      </div>
      <p className="text-sm font-semibold text-[#667085]">{label}</p>
      <strong className="mt-1 block text-2xl font-extrabold text-[#0B1F4D]">{value}</strong>
    </Card>
  );

  return href ? (
    <Link className="block h-full" href={href}>
      {content}
    </Link>
  ) : (
    content
  );
}

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
    const dailyTargetHours = settings?.daily_target_hours ?? 8;
    const weeklyTargetHours = settings?.weekly_target_hours ?? 40;
    const activeTasks = getActiveTasks(data.tasks);
    const dueSoonTasks = getDueSoonTasks(data.tasks);
    const weeklyTimeLogs = getWeeklyTimeLogs(data.timeLogs, settings?.week_starts_on ?? "monday");
    const latestEmotionNote = getLatestEmotionNote(data.notes);
    const todayTime = data.timeLogs.filter((timeLog) => timeLog.log_date === getTodayDate());
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
      activeTasks: activeTasks.slice(0, 3),
      dueSoonTasks,
      recentMeetings: data.meetings.slice(0, 3),
      weeklyTimeLogs,
      todayHours,
      dailyTargetHours,
      weeklyTargetHours,
      weeklyTotalHours,
      codingHours: sumTimeLogHours(weeklyTimeLogs, ["coding_study"]),
      paperHours: sumTimeLogHours(weeklyTimeLogs, ["paper_review"]),
      workHours: sumTimeLogHours(weeklyTimeLogs, ["company_work"]),
      averageGoalProgress: getAverageGoalProgress(data.goals),
      recentReflection: data.reflections[0],
      emotionNote: latestEmotionNote,
      emotionSummary: getEmotionSummary(latestEmotionNote),
    };
  }, [data]);

  if (loading) {
    return <Card>Time Tracker 대시보드를 불러오는 중입니다.</Card>;
  }

  if (!summary) {
    return (
      <Card>
        <h2 className="font-extrabold text-[#0B1F4D]">대시보드 데이터를 불러오지 못했습니다.</h2>
        {error ? <p className="mt-2 text-sm text-[#C92735]">{error}</p> : null}
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {error ? <p className="rounded-2xl bg-[#FEF2F2] p-4 text-sm text-[#C92735]">{error}</p> : null}

      <div className="rounded-[2rem] border border-[#E3E8F2] bg-[#0B1F4D] p-5 text-white shadow-[0_22px_50px_rgba(11,31,77,0.18)] sm:p-7">
        <p className="text-sm font-bold text-[#BFD0FF]">Time Tracker Web</p>
        <div className="mt-2 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl">
              안녕하세요, {summary.displayName || "개발자"}님!
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#D7E2FF]">
              오늘의 업무 시간, 진행 중 업무, 목표와 회고를 한눈에 확인하세요.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold">
            {summary.today} · {summary.dDay ? `D+${summary.dDay}` : "입사일 미설정"}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={CalendarDays}
          iconBgClass="bg-[#EEF3FF]"
          iconClass="text-[#0B1F4D]"
          label="입사 D+일차"
          value={summary.dDay ? `D+${summary.dDay}` : "미설정"}
        />
        <SummaryCard
          href="/routines"
          icon={Clock3}
          iconBgClass="bg-[#EFF6FF]"
          iconClass="text-[#175CD3]"
          label="오늘 기록 시간"
          value={`${summary.todayHours}h / 목표 ${summary.dailyTargetHours}h`}
        />
        <SummaryCard
          href="/tasks"
          icon={CheckSquare}
          iconBgClass="bg-[#FEF2F2]"
          iconClass="text-[#C92735]"
          label="진행 중 업무"
          value={`${summary.activeTasks.length}건`}
        />
        <SummaryCard
          href="/routines/goals"
          icon={Target}
          iconBgClass="bg-[#ECFDF3]"
          iconClass="text-[#027A48]"
          label="목표 진행률"
          value={summary.averageGoalProgress === null ? "--" : `${summary.averageGoalProgress}%`}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <SectionHeader href="/notes" title="최근 노트" />
          {summary.recentNotes.length === 0 ? (
            <EmptyText>아직 노트가 없습니다. 배운 내용을 첫 노트로 남겨보세요.</EmptyText>
          ) : (
            <div className="space-y-3">
              {summary.recentNotes.map((note) => (
                <Link className="block rounded-2xl border border-[#E3E8F2] p-4 transition-colors hover:bg-[#F5F7FB]" href={`/notes/${note.id}`} key={note.id}>
                  <p className="font-extrabold text-[#0B1F4D]">{note.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#667085]">{note.content}</p>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <SectionHeader href="/tasks" title="업무 요약" />
          <div className="space-y-4">
            {summary.activeTasks.length === 0 ? (
              <EmptyText>진행 중인 업무가 없습니다.</EmptyText>
            ) : (
              <div className="space-y-3">
                {summary.activeTasks.map((task) => (
                  <Link className="block rounded-2xl bg-[#F5F7FB] p-4" href={`/tasks/${task.id}`} key={task.id}>
                    <p className="font-bold text-[#0B1F4D]">{task.title}</p>
                    <p className="mt-1 text-sm text-[#667085]">마감 {task.due_date ?? "-"}</p>
                  </Link>
                ))}
              </div>
            )}
            <div>
              <p className="mb-2 text-xs font-extrabold text-[#C92735]">마감 임박</p>
              {summary.dueSoonTasks.length === 0 ? (
                <p className="text-sm text-[#667085]">3일 안에 마감되는 업무가 없습니다.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {summary.dueSoonTasks.map((task) => (
                    <Link className="rounded-full bg-[#FEF2F2] px-3 py-1.5 text-xs font-bold text-[#C92735]" href={`/tasks/${task.id}`} key={task.id}>
                      {task.title} · {task.due_date}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card>
          <SectionHeader href="/routines" title="이번 주 시간 요약" />
          <div className="mb-4 rounded-2xl bg-[#F5F7FB] p-4">
            <p className="text-xs font-extrabold text-[#667085]">이번 주 기록 시간</p>
            <p className="mt-1 text-xl font-extrabold text-[#0B1F4D]">
              {summary.weeklyTotalHours}h / 목표 {summary.weeklyTargetHours}h
            </p>
          </div>
          {summary.weeklyTimeLogs.length === 0 ? (
            <EmptyText>이번 주 데일리 시간 기록이 없습니다.</EmptyText>
          ) : (
            <div className="space-y-3">
              {[
                ["코딩 공부", summary.codingHours, "bg-[#D7E8FF]"],
                ["논문 리뷰", summary.paperHours, "bg-[#E9D7FE]"],
                ["업무", summary.workHours, "bg-[#D1FADF]"],
              ].map(([label, value, color]) => (
                <div key={label as string}>
                  <div className="mb-1 flex justify-between text-sm font-bold text-[#0B1F4D]">
                    <span>{label}</span>
                    <span>{value}h</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#EEF2F6]">
                    <div className={`h-2 rounded-full ${color}`} style={{ width: `${Math.min(100, Number(value) * 10)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <SectionHeader href="/reflections" title="최근 회고" />
          {!summary.recentReflection ? (
            <EmptyText>아직 회고가 없습니다.</EmptyText>
          ) : (
            <Link className="block" href={`/reflections/${summary.recentReflection.id}`}>
              <p className="text-sm font-bold text-[#667085]">{summary.recentReflection.reflection_date}</p>
              <p className="mt-2 line-clamp-3 font-bold leading-6 text-[#0B1F4D]">{summary.recentReflection.learned}</p>
              {summary.recentReflection.tomorrow_action ? (
                <p className="mt-3 rounded-2xl bg-[#F5F7FB] p-3 text-sm leading-6 text-[#667085]">
                  내일 행동: {summary.recentReflection.tomorrow_action}
                </p>
              ) : null}
            </Link>
          )}
        </Card>

        <Card>
          <SectionHeader href="/notes" title="최근 감정 상태" />
          {!summary.emotionSummary ? (
            <EmptyText>아직 감정노트가 없습니다.</EmptyText>
          ) : (
            <Link className="block" href={summary.emotionNote ? `/notes/${summary.emotionNote.id}` : "/notes"}>
              <p className="text-2xl font-extrabold text-[#0B1F4D]">{summary.emotionSummary.emotion}</p>
              <p className="mt-1 text-sm font-semibold text-[#667085]">강도 {summary.emotionSummary.intensity ?? "-"}</p>
              {summary.emotionSummary.situation ? (
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#667085]">{summary.emotionSummary.situation}</p>
              ) : null}
            </Link>
          )}
        </Card>
      </div>

      <Card>
        <SectionHeader href="/meetings" title="최근 미팅" />
        {summary.recentMeetings.length === 0 ? (
          <EmptyText>아직 미팅 기록이 없습니다.</EmptyText>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {summary.recentMeetings.map((meeting) => (
              <Link className="rounded-2xl border border-[#E3E8F2] p-4 hover:bg-[#F5F7FB]" href={`/meetings/${meeting.id}`} key={meeting.id}>
                <p className="font-bold text-[#0B1F4D]">{meeting.title}</p>
                <p className="mt-2 text-sm text-[#667085]">{meeting.meeting_date}</p>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
