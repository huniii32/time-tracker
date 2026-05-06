import type { Reflection, ReflectionInsert, ReflectionUpdate } from "@/types";

export type ReflectionFormValues = {
  reflection_date: string;
  learned: string;
  difficult: string;
  good: string;
  tomorrow_action: string;
  communication_lesson: string;
  technical_lesson: string;
  emotional_care: string;
};

export function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

export function getInitialReflectionFormValues(
  reflection?: Reflection,
): ReflectionFormValues {
  return {
    reflection_date: reflection?.reflection_date ?? getTodayDate(),
    learned: reflection?.learned ?? "",
    difficult: reflection?.difficult ?? "",
    good: reflection?.good ?? "",
    tomorrow_action: reflection?.tomorrow_action ?? "",
    communication_lesson: reflection?.communication_lesson ?? "",
    technical_lesson: reflection?.technical_lesson ?? "",
    emotional_care: reflection?.emotional_care ?? "",
  };
}

export function buildReflectionInsert(
  values: ReflectionFormValues,
): Omit<ReflectionInsert, "user_id"> {
  return {
    reflection_date: values.reflection_date,
    learned: values.learned.trim(),
    difficult: values.difficult.trim() || null,
    good: values.good.trim() || null,
    tomorrow_action: values.tomorrow_action.trim() || null,
    communication_lesson: values.communication_lesson.trim() || null,
    technical_lesson: values.technical_lesson.trim() || null,
    emotional_care: values.emotional_care.trim() || null,
  };
}

export function buildReflectionUpdate(values: ReflectionFormValues): ReflectionUpdate {
  return buildReflectionInsert(values);
}
