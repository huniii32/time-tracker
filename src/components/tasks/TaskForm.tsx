"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { createTask, updateTask } from "@/lib/queries/tasks";
import { createClient } from "@/lib/supabase/browser";
import { priorityOptions, taskStatusOptions } from "@/lib/tasks/config";
import {
  buildTaskInsert,
  buildTaskUpdate,
  getInitialTaskFormValues,
  type TaskFormValues,
} from "@/lib/tasks/form";
import type { Priority, Task, TaskStatus } from "@/types";

type TaskFormProps = {
  mode: "create" | "edit";
  task?: Task;
};

export function TaskForm({ mode, task }: TaskFormProps) {
  const router = useRouter();
  const initialValues = useMemo(() => getInitialTaskFormValues(task), [task]);
  const [values, setValues] = useState<TaskFormValues>(initialValues);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField(name: keyof TaskFormValues, value: string) {
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
        const { data, error: createError } = await createTask(
          supabase,
          user.id,
          buildTaskInsert(values),
        );

        if (createError) {
          setError(createError.message);
          return;
        }

        router.replace(`/tasks/${data.id}`);
        router.refresh();
        return;
      }

      if (!task) {
        setError("저장할 업무 정보가 없습니다.");
        return;
      }

      const { data, error: updateError } = await updateTask(
        supabase,
        user.id,
        task.id,
        buildTaskUpdate(values),
      );

      if (updateError) {
        setError(updateError.message);
        return;
      }

      router.replace(`/tasks/${data.id}`);
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
            업무명
            <input
              className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("title", event.target.value)}
              required
              value={values.title}
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-[#1F2F5C]">
              요청자
              <input
                className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
                onChange={(event) => updateField("requester", event.target.value)}
                value={values.requester}
              />
            </label>
            <label className="block text-sm font-semibold text-[#1F2F5C]">
              마감일
              <input
                className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
                onChange={(event) => updateField("due_date", event.target.value)}
                type="date"
                value={values.due_date}
              />
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-[#1F2F5C]">
              우선순위
              <select
                className="mt-1 w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-3 text-base"
                onChange={(event) => updateField("priority", event.target.value as Priority)}
                value={values.priority}
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-semibold text-[#1F2F5C]">
              상태
              <select
                className="mt-1 w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-3 text-base"
                onChange={(event) => updateField("status", event.target.value as TaskStatus)}
                value={values.status}
              >
                {taskStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            목표
            <textarea
              className="mt-1 min-h-24 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("goal", event.target.value)}
              value={values.goal}
            />
          </label>
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            산출물
            <textarea
              className="mt-1 min-h-24 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("output", event.target.value)}
              value={values.output}
            />
          </label>
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            피드백
            <textarea
              className="mt-1 min-h-24 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("feedback", event.target.value)}
              value={values.feedback}
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-[#1F2F5C]">
              만족도              <input
                className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
                max={5}
                min={1}
                onChange={(event) => updateField("satisfaction", event.target.value)}
                placeholder="1-5"
                type="number"
                value={values.satisfaction}
              />
            </label>
            <label className="block text-sm font-semibold text-[#1F2F5C]">
              태그
              <input
                className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
                onChange={(event) => updateField("tags", event.target.value)}
                placeholder="태그를 입력하세요"
                value={values.tags}
              />
            </label>
          </div>
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
