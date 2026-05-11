import { getKstTodayString } from "@/lib/dates";
import type { WeeklyReview, WeeklyReviewInsert, WeeklyReviewUpdate } from "@/types";

export type WeeklyReviewFormValues = {
  week_start: string;
  goals: string;
  achievement_rate: string;
  wasted_hours: string;
  routine_satisfaction: string;
  best: string;
  regret: string;
  learned: string;
  next_week_action: string;
};

export function getTodayDate() {
  return getKstTodayString();
}

export function getInitialWeeklyReviewFormValues(
  review?: WeeklyReview,
): WeeklyReviewFormValues {
  return {
    week_start: review?.week_start ?? getTodayDate(),
    goals: review?.goals ?? "",
    achievement_rate:
      review?.achievement_rate === null || review?.achievement_rate === undefined
        ? ""
        : String(review.achievement_rate),
    wasted_hours:
      review?.wasted_hours === null || review?.wasted_hours === undefined
        ? ""
        : String(review.wasted_hours),
    routine_satisfaction:
      review?.routine_satisfaction === null || review?.routine_satisfaction === undefined
        ? ""
        : String(review.routine_satisfaction),
    best: review?.best ?? "",
    regret: review?.regret ?? "",
    learned: review?.learned ?? "",
    next_week_action: review?.next_week_action ?? "",
  };
}

function normalizePercent(value: string) {
  if (!value) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return Math.min(100, Math.max(0, parsed));
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

function normalizeHours(value: string) {
  if (!value) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return Math.max(0, parsed);
}

export function buildWeeklyReviewInsert(
  values: WeeklyReviewFormValues,
): Omit<WeeklyReviewInsert, "user_id"> {
  return {
    week_start: values.week_start,
    goals: values.goals.trim() || null,
    achievement_rate: normalizePercent(values.achievement_rate),
    wasted_hours: normalizeHours(values.wasted_hours),
    routine_satisfaction: normalizeScore(values.routine_satisfaction),
    best: values.best.trim() || null,
    regret: values.regret.trim() || null,
    learned: values.learned.trim() || null,
    next_week_action: values.next_week_action.trim() || null,
  };
}

export function buildWeeklyReviewUpdate(values: WeeklyReviewFormValues): WeeklyReviewUpdate {
  return buildWeeklyReviewInsert(values);
}
