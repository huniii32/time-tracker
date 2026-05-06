import type { TimeLog, TimeLogCategory, TimeLogInsert, TimeLogUpdate } from "@/types";

export const timeLogCategoryOptions: Array<{ value: TimeLogCategory; label: string }> = [
  { value: "company_work", label: "회사 업무" },
  { value: "coding_study", label: "코딩 공부" },
  { value: "paper_review", label: "논문 리뷰" },
  { value: "onboarding_log", label: "회사 적응 기록" },
  { value: "exercise", label: "운동" },
  { value: "rest", label: "휴식" },
  { value: "commute", label: "이동" },
  { value: "sleep", label: "수면" },
  { value: "other", label: "기타" },
];

export type TimeLogFormValues = {
  log_date: string;
  start_time: string;
  end_time: string;
  category: TimeLogCategory;
  activity: string;
  focus_score: string;
  satisfaction: string;
  memo: string;
};

export function getTimeLogCategoryLabel(category: TimeLogCategory) {
  return timeLogCategoryOptions.find((option) => option.value === category)?.label ?? category;
}

export function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

export function getInitialTimeLogFormValues(timeLog?: TimeLog): TimeLogFormValues {
  return {
    log_date: timeLog?.log_date ?? getTodayDate(),
    start_time: timeLog?.start_time?.slice(0, 5) ?? "09:00",
    end_time: timeLog?.end_time?.slice(0, 5) ?? "10:00",
    category: timeLog?.category ?? "company_work",
    activity: timeLog?.activity ?? "",
    focus_score: timeLog?.focus_score ? String(timeLog.focus_score) : "",
    satisfaction: timeLog?.satisfaction ? String(timeLog.satisfaction) : "",
    memo: timeLog?.memo ?? "",
  };
}

function normalizeScore(value: string) {
  if (!value) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return Math.min(5, Math.max(1, parsed));
}

export function buildTimeLogInsert(values: TimeLogFormValues): Omit<TimeLogInsert, "user_id"> {
  return {
    log_date: values.log_date,
    start_time: values.start_time,
    end_time: values.end_time,
    category: values.category,
    activity: values.activity.trim(),
    focus_score: normalizeScore(values.focus_score),
    satisfaction: normalizeScore(values.satisfaction),
    memo: values.memo.trim() || null,
  };
}

export function buildTimeLogUpdate(values: TimeLogFormValues): TimeLogUpdate {
  return buildTimeLogInsert(values);
}

export function formatDuration(startTime: string, endTime: string) {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  if (
    !Number.isFinite(startHour) ||
    !Number.isFinite(startMinute) ||
    !Number.isFinite(endHour) ||
    !Number.isFinite(endMinute)
  ) {
    return "-";
  }

  const start = startHour * 60 + startMinute;
  let end = endHour * 60 + endMinute;

  if (end < start) {
    end += 24 * 60;
  }

  const diff = Math.max(0, end - start);
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  if (hours === 0) {
    return `${minutes}분`;
  }

  if (minutes === 0) {
    return `${hours}시간`;
  }

  return `${hours}시간 ${minutes}분`;
}
