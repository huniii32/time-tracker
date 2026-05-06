"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { createTimeLog, updateTimeLog } from "@/lib/queries/timeLogs";
import {
  buildTimeLogInsert,
  buildTimeLogUpdate,
  getInitialTimeLogFormValues,
  timeLogCategoryOptions,
  type TimeLogFormValues,
} from "@/lib/routines/timeLogs";
import { createClient } from "@/lib/supabase/browser";
import type { TimeLog, TimeLogCategory } from "@/types";

type TimeLogFormProps = {
  mode: "create" | "edit";
  timeLog?: TimeLog;
};

export function TimeLogForm({ mode, timeLog }: TimeLogFormProps) {
  const router = useRouter();
  const initialValues = useMemo(() => getInitialTimeLogFormValues(timeLog), [timeLog]);
  const [values, setValues] = useState<TimeLogFormValues>(initialValues);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField(name: keyof TimeLogFormValues, value: string) {
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
        const { data, error: createError } = await createTimeLog(
          supabase,
          user.id,
          buildTimeLogInsert(values),
        );

        if (createError) {
          setError(createError.message);
          return;
        }

        router.replace(`/routines/time-logs/${data.id}`);
        router.refresh();
        return;
      }

      if (!timeLog) {
        setError("?섏젙???쒓컙 湲곕줉??李얠쓣 ???놁뒿?덈떎.");
        return;
      }

      const { data, error: updateError } = await updateTimeLog(
        supabase,
        user.id,
        timeLog.id,
        buildTimeLogUpdate(values),
      );

      if (updateError) {
        setError(updateError.message);
        return;
      }

      router.replace(`/routines/time-logs/${data.id}`);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            ?좎쭨
            <input
              className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("log_date", event.target.value)}
              required
              type="date"
              value={values.log_date}
            />
          </label>
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            ?쒕룞 移댄뀒怨좊━
            <select
              className="mt-1 w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-3 text-base"
              onChange={(event) =>
                updateField("category", event.target.value as TimeLogCategory)
              }
              value={values.category}
            >
              {timeLogCategoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            ?쒖옉 ?쒓컙
            <input
              className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("start_time", event.target.value)}
              required
              type="time"
              value={values.start_time}
            />
          </label>
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            醫낅즺 ?쒓컙
            <input
              className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("end_time", event.target.value)}
              required
              type="time"
              value={values.end_time}
            />
          </label>
        </div>
      </div>

      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            ?쒕룞 ?댁슜
            <input
              className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("activity", event.target.value)}
              required
              value={values.activity}
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-[#1F2F5C]">
              吏묒쨷??              <input
                className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
                max={5}
                min={1}
                onChange={(event) => updateField("focus_score", event.target.value)}
                placeholder="1-5"
                type="number"
                value={values.focus_score}
              />
            </label>
            <label className="block text-sm font-semibold text-[#1F2F5C]">
              留뚯”??              <input
                className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
                max={5}
                min={1}
                onChange={(event) => updateField("satisfaction", event.target.value)}
                placeholder="1-5"
                type="number"
                value={values.satisfaction}
              />
            </label>
          </div>
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            硫붾え
            <textarea
              className="mt-1 min-h-28 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("memo", event.target.value)}
              value={values.memo}
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
