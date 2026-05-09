import type { TimeLog, TimeLogCategory, TimeLogInsert, TimeLogUpdate } from "@/types";

export const timeLogCategoryOptions: Array<{ value: TimeLogCategory; label: string }> = [
  { value: "exercise", label: "운동" },
  { value: "coding_study", label: "공부" },
  { value: "company_work", label: "업무" },
  { value: "other", label: "여가 활동" },
  { value: "rest", label: "휴식" },
  { value: "commute", label: "이동" },
  { value: "sleep", label: "수면" },
];

const legacyCategoryLabels: Record<TimeLogCategory, string> = {
  company_work: "업무",
  coding_study: "공부",
  paper_review: "공부",
  onboarding_log: "업무",
  exercise: "운동",
  rest: "휴식",
  commute: "이동",
  sleep: "수면",
  other: "여가 활동",
};

const normalizedCategoryValues: Record<TimeLogCategory, TimeLogCategory> = {
  company_work: "company_work",
  coding_study: "coding_study",
  paper_review: "coding_study",
  onboarding_log: "company_work",
  exercise: "exercise",
  rest: "rest",
  commute: "commute",
  sleep: "sleep",
  other: "other",
};

export type TimeLogFormValues = {
  log_date: string;
  start_time: string;
  end_time: string;
  category: TimeLogCategory;
  activity: string;
  focus_score: string;
  memo: string;
};

export function getTimeLogCategoryLabel(category: TimeLogCategory) {
  return legacyCategoryLabels[category] ?? category;
}

export function normalizeTimeLogCategory(category: TimeLogCategory) {
  return normalizedCategoryValues[category] ?? "other";
}

export function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

export function getInitialTimeLogFormValues(timeLog?: TimeLog): TimeLogFormValues {
  return {
    log_date: timeLog?.log_date ?? getTodayDate(),
    start_time: timeLog?.start_time?.slice(0, 5) ?? "09:00",
    end_time: timeLog?.end_time?.slice(0, 5) ?? "10:00",
    category: timeLog ? normalizeTimeLogCategory(timeLog.category) : "company_work",
    activity: timeLog?.activity ?? "",
    focus_score: timeLog?.focus_score ? String(timeLog.focus_score) : "",
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
    memo: values.memo.trim() || null,
  };
}

export function buildTimeLogUpdate(values: TimeLogFormValues): TimeLogUpdate {
  return buildTimeLogInsert(values);
}

export function getDurationMinutes(startTime: string, endTime: string) {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  if (
    !Number.isFinite(startHour) ||
    !Number.isFinite(startMinute) ||
    !Number.isFinite(endHour) ||
    !Number.isFinite(endMinute)
  ) {
    return 0;
  }

  const start = startHour * 60 + startMinute;
  let end = endHour * 60 + endMinute;

  if (end < start) {
    end += 24 * 60;
  }

  return Math.max(0, end - start);
}

export function formatDuration(startTime: string, endTime: string) {
  return formatMinutes(getDurationMinutes(startTime, endTime));
}

export function formatMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}분`;
  }

  if (minutes === 0) {
    return `${hours}시간`;
  }

  return `${hours}시간 ${minutes}분`;
}
