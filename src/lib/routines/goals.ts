import type { Goal, GoalInsert, GoalLevel, GoalType, GoalUpdate, Priority } from "@/types";

export const goalTypeOptions: Array<{
  value: GoalType;
  label: string;
  description: string;
}> = [
  {
    value: "onboarding",
    label: "회사 적응",
    description: "회사 문화, 상사/동료 커뮤니케이션, 조직 이해 관련 목표",
  },
  {
    value: "work_performance",
    label: "업무 성과",
    description: "맡은 업무, 프로젝트, 결과물, 마감 관리 관련 목표",
  },
  {
    value: "coding_skill",
    label: "직무 관련",
    description: "코딩, LLM, 데이터 분석, 논문 리뷰, 기술 공부 관련 목표",
  },
  {
    value: "certification",
    label: "자격증",
    description: "정처기, 빅분기, 토익스피킹 등 시험 및 자격 취득 목표",
  },
  {
    value: "health",
    label: "건강 관리",
    description: "운동, 수면, 식단, 체력 관리 관련 목표",
  },
  {
    value: "llm_understanding",
    label: "생활 관리",
    description: "소비, 루틴, 시간관리, 정리 습관 관련 목표",
  },
  {
    value: "other",
    label: "기타",
    description: "위 항목에 넣기 애매한 목표",
  },
];

export const goalLevelOptions: Array<{ value: GoalLevel; label: string }> = [
  { value: "quarter", label: "분기" },
  { value: "month", label: "월간" },
  { value: "week", label: "주간" },
  { value: "day", label: "일간" },
];

export const priorityOptions: Array<{ value: Priority; label: string }> = [
  { value: "low", label: "낮음" },
  { value: "medium", label: "보통" },
  { value: "high", label: "높음" },
];

export type GoalFormValues = {
  title: string;
  goal_type: GoalType;
  goal_level: GoalLevel;
  period: string;
  priority: Priority;
  success_criteria: string;
  progress: string;
  retrospective: string;
};

export function getGoalTypeLabel(goalType: GoalType) {
  return goalTypeOptions.find((option) => option.value === goalType)?.label ?? goalType;
}

export function getGoalTypeDescription(goalType: GoalType) {
  return goalTypeOptions.find((option) => option.value === goalType)?.description ?? "";
}

export function getGoalLevelLabel(goalLevel: GoalLevel) {
  return goalLevelOptions.find((option) => option.value === goalLevel)?.label ?? goalLevel;
}

export function getPriorityLabel(priority: Priority) {
  return priorityOptions.find((option) => option.value === priority)?.label ?? priority;
}

export function getInitialGoalFormValues(goal?: Goal): GoalFormValues {
  return {
    title: goal?.title ?? "",
    goal_type: goal?.goal_type ?? "onboarding",
    goal_level: goal?.goal_level ?? "quarter",
    period: goal?.period ?? "",
    priority: goal?.priority ?? "medium",
    success_criteria: goal?.success_criteria ?? "",
    progress:
      goal?.progress === null || goal?.progress === undefined ? "0" : String(goal.progress),
    retrospective: goal?.retrospective ?? "",
  };
}

function normalizeProgress(value: string) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(parsed)));
}

export function buildGoalInsert(values: GoalFormValues): Omit<GoalInsert, "user_id"> {
  return {
    title: values.title.trim(),
    goal_type: values.goal_type,
    goal_level: values.goal_level,
    period: values.period.trim() || null,
    priority: values.priority,
    success_criteria: values.success_criteria.trim() || null,
    progress: normalizeProgress(values.progress),
    retrospective: values.retrospective.trim() || null,
  };
}

export function buildGoalUpdate(values: GoalFormValues): GoalUpdate {
  return buildGoalInsert(values);
}
