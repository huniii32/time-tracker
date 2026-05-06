"use client";

import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/common/Card";
import { getUserSettings, upsertUserSettings } from "@/lib/queries/settings";
import { createClient } from "@/lib/supabase/browser";
import type { DefaultStartPage, UserSettings, WeekStartDay } from "@/types";

const weekStartOptions: Array<{ label: string; value: WeekStartDay }> = [
  { label: "일요일", value: "sunday" },
  { label: "월요일", value: "monday" },
  { label: "화요일", value: "tuesday" },
  { label: "수요일", value: "wednesday" },
  { label: "목요일", value: "thursday" },
  { label: "금요일", value: "friday" },
  { label: "토요일", value: "saturday" },
];

const startPageOptions: Array<{ label: string; value: DefaultStartPage }> = [
  { label: "홈", value: "home" },
  { label: "노트", value: "notes" },
  { label: "업무", value: "tasks" },
  { label: "미팅", value: "meetings" },
  { label: "루틴", value: "routines" },
  { label: "회고", value: "reflections" },
];

type SettingsFormState = {
  display_name: string;
  joined_at: string;
  role: string;
  team: string;
  daily_target_hours: string;
  weekly_target_hours: string;
  week_starts_on: WeekStartDay;
  default_start_page: DefaultStartPage;
};

const defaultForm: SettingsFormState = {
  display_name: "",
  joined_at: "",
  role: "",
  team: "",
  daily_target_hours: "8",
  weekly_target_hours: "40",
  week_starts_on: "monday",
  default_start_page: "home",
};

function toFormState(settings: UserSettings | null): SettingsFormState {
  if (!settings) {
    return defaultForm;
  }

  return {
    display_name: settings.display_name ?? "",
    joined_at: settings.joined_at ?? "",
    role: settings.role ?? "",
    team: settings.team ?? "",
    daily_target_hours: String(settings.daily_target_hours ?? 8),
    weekly_target_hours: String(settings.weekly_target_hours ?? 40),
    week_starts_on: settings.week_starts_on ?? "monday",
    default_start_page: settings.default_start_page ?? "home",
  };
}

function toPositiveNumber(value: string, fallback: number) {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : fallback;
}

export function SettingsForm() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [form, setForm] = useState<SettingsFormState>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadSettings() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setUserId(user.id);

      const { data, error: settingsError } = await getUserSettings(supabase, user.id);

      if (settingsError) {
        setError(settingsError.message);
      } else {
        setForm(toFormState(data ?? null));
      }

      setLoading(false);
    }

    void loadSettings();
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!userId) {
      setError("로그인이 필요합니다.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const supabase = createClient();
    const { data, error: saveError } = await upsertUserSettings(supabase, userId, {
      display_name: form.display_name.trim() || null,
      joined_at: form.joined_at || null,
      role: form.role.trim() || null,
      team: form.team.trim() || null,
      daily_target_hours: toPositiveNumber(form.daily_target_hours, 8),
      weekly_target_hours: toPositiveNumber(form.weekly_target_hours, 40),
      week_starts_on: form.week_starts_on,
      default_start_page: form.default_start_page,
    });

    if (saveError) {
      setError(saveError.message);
    } else {
      setForm(toFormState(data ?? null));
      setSuccess("설정을 저장했습니다.");
    }

    setSaving(false);
  }

  if (loading) {
    return <Card>설정을 불러오는 중입니다.</Card>;
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error ? <p className="rounded-2xl bg-[#FEF2F2] p-4 text-sm text-[#C92735]">{error}</p> : null}
      {success ? <p className="rounded-2xl bg-[#ECFDF3] p-4 text-sm font-bold text-[#027A48]">{success}</p> : null}

      <Card>
        <div className="mb-5">
          <p className="text-sm font-extrabold text-[#C92735]">프로필 설정</p>
          <h2 className="mt-1 text-xl font-extrabold text-[#0B1F4D]">기본 정보</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-bold text-[#0B1F4D]">이름</span>
            <input
              onChange={(event) => setForm((current) => ({ ...current, display_name: event.target.value }))}
              placeholder="홍길동"
              value={form.display_name}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-[#0B1F4D]">입사일</span>
            <input
              onChange={(event) => setForm((current) => ({ ...current, joined_at: event.target.value }))}
              type="date"
              value={form.joined_at}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-[#0B1F4D]">직무</span>
            <input
              onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
              placeholder="Frontend Developer"
              value={form.role}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-[#0B1F4D]">소속 팀</span>
            <input
              onChange={(event) => setForm((current) => ({ ...current, team: event.target.value }))}
              placeholder="Product Team"
              value={form.team}
            />
          </label>
        </div>
      </Card>

      <Card>
        <div className="mb-5">
          <p className="text-sm font-extrabold text-[#C92735]">시간 기준 설정</p>
          <h2 className="mt-1 text-xl font-extrabold text-[#0B1F4D]">기록 목표</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm font-bold text-[#0B1F4D]">하루 목표 기록 시간</span>
            <input
              min="0.5"
              onChange={(event) => setForm((current) => ({ ...current, daily_target_hours: event.target.value }))}
              step="0.5"
              type="number"
              value={form.daily_target_hours}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-[#0B1F4D]">주간 목표 기록 시간</span>
            <input
              min="1"
              onChange={(event) => setForm((current) => ({ ...current, weekly_target_hours: event.target.value }))}
              step="0.5"
              type="number"
              value={form.weekly_target_hours}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-[#0B1F4D]">주간 시작 요일</span>
            <select
              onChange={(event) =>
                setForm((current) => ({ ...current, week_starts_on: event.target.value as WeekStartDay }))
              }
              value={form.week_starts_on}
            >
              {weekStartOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      <Card>
        <div className="mb-5">
          <p className="text-sm font-extrabold text-[#C92735]">앱 표시 설정</p>
          <h2 className="mt-1 text-xl font-extrabold text-[#0B1F4D]">기본 시작 화면</h2>
        </div>
        <label className="block space-y-2">
          <span className="text-sm font-bold text-[#0B1F4D]">앱 진입 후 기본 화면</span>
          <select
            onChange={(event) =>
              setForm((current) => ({ ...current, default_start_page: event.target.value as DefaultStartPage }))
            }
            value={form.default_start_page}
          >
            {startPageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </Card>

      <div className="sticky bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-10 rounded-2xl border border-[#E3E8F2] bg-white/95 p-3 shadow-[0_12px_30px_rgba(11,31,77,0.12)] backdrop-blur lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
        <button
          className="w-full rounded-2xl bg-[#0B1F4D] px-5 py-4 text-base font-extrabold text-white shadow-[0_10px_22px_rgba(11,31,77,0.18)] disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto lg:px-8"
          disabled={saving}
          type="submit"
        >
          {saving ? "저장 중..." : "저장하기"}
        </button>
      </div>
    </form>
  );
}
