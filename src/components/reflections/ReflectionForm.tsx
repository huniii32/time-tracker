"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import {
  createReflection,
  updateReflection,
} from "@/lib/queries/reflections";
import {
  buildReflectionInsert,
  buildReflectionUpdate,
  getInitialReflectionFormValues,
  type ReflectionFormValues,
} from "@/lib/reflections/form";
import { createClient } from "@/lib/supabase/browser";
import type { Reflection } from "@/types";

type ReflectionFormProps = {
  mode: "create" | "edit";
  reflection?: Reflection;
};

export function ReflectionForm({ mode, reflection }: ReflectionFormProps) {
  const router = useRouter();
  const initialValues = useMemo(
    () => getInitialReflectionFormValues(reflection),
    [reflection],
  );
  const [values, setValues] = useState<ReflectionFormValues>(initialValues);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField(name: keyof ReflectionFormValues, value: string) {
    setValues((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      if (mode === "create") {
        const { data, error: createError } = await createReflection(
          supabase,
          user.id,
          buildReflectionInsert(values),
        );

        if (createError) {
          setError(createError.message);
          return;
        }

        router.replace(`/reflections/${data.id}`);
        router.refresh();
        return;
      }

      if (!reflection) {
        setError("저장할 회고 정보가 없습니다.");
        return;
      }

      const { data, error: updateError } = await updateReflection(
        supabase,
        user.id,
        reflection.id,
        buildReflectionUpdate(values),
      );

      if (updateError) {
        setError(updateError.message);
        return;
      }

      router.replace(`/reflections/${data.id}`);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            작성일
            <input
              className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("reflection_date", event.target.value)}
              required
              type="date"
              value={values.reflection_date}
            />
          </label>
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            오늘 배운 점
            <textarea
              className="mt-1 min-h-28 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("learned", event.target.value)}
              required
              value={values.learned}
            />
          </label>
        </div>
      </div>

      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            어려웠던 점
            <textarea
              className="mt-1 min-h-24 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("difficult", event.target.value)}
              value={values.difficult}
            />
          </label>
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            잘한 점
            <textarea
              className="mt-1 min-h-24 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("good", event.target.value)}
              value={values.good}
            />
          </label>
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            내일 적용할 행동
            <textarea
              className="mt-1 min-h-24 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("tomorrow_action", event.target.value)}
              value={values.tomorrow_action}
            />
          </label>
        </div>
      </div>

      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            커뮤니케이션 인사이트
            <textarea
              className="mt-1 min-h-24 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("communication_lesson", event.target.value)}
              value={values.communication_lesson}
            />
          </label>
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            기술 인사이트
            <textarea
              className="mt-1 min-h-24 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("technical_lesson", event.target.value)}
              value={values.technical_lesson}
            />
          </label>
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            감정 관리 포인트
            <textarea
              className="mt-1 min-h-24 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("emotional_care", event.target.value)}
              value={values.emotional_care}
            />
          </label>
        </div>
      </div>

      {error ? <p className="text-sm text-[#C92735]">{error}</p> : null}

      <div className="form-actions grid grid-cols-2 gap-3">
        <button
          className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-bold text-[#1F2F5C]"
          onClick={() => router.back()}
          type="button"
        >취소</button>
        <button
          className="rounded-lg bg-[#1F2F5C] px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
          disabled={saving}
          type="submit"
        >
          {saving ? "저장 중" : mode === "create" ? "작성" : "수정"}
        </button>
      </div>
    </form>
  );
}
