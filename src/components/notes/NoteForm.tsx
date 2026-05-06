"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { createNote, updateNote } from "@/lib/queries/notes";
import { getNoteTypeConfig, noteTypeConfigs } from "@/lib/notes/config";
import {
  buildNoteInsert,
  buildNoteUpdate,
  getInitialNoteFormValues,
  type NoteFormValues,
} from "@/lib/notes/form";
import type { Note, NoteType } from "@/types";

type NoteFormProps = {
  note?: Note;
  mode: "create" | "edit";
};

export function NoteForm({ mode, note }: NoteFormProps) {
  const router = useRouter();
  const initialValues = useMemo(() => getInitialNoteFormValues(note), [note]);
  const [values, setValues] = useState<NoteFormValues>(initialValues);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const selectedConfig = getNoteTypeConfig(values.note_type);

  function updateField(name: string, value: string) {
    setValues((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function updateCustomField(name: string, value: string) {
    setValues((current) => ({
      ...current,
      fields: {
        ...current.fields,
        [name]: value,
      },
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
        const { data, error: createError } = await createNote(
          supabase,
          user.id,
          buildNoteInsert(values),
        );

        if (createError) {
          setError(createError.message);
          return;
        }

        router.replace(`/notes/${data.id}`);
        router.refresh();
        return;
      }

      if (!note) {
        setError("?섏젙???명듃瑜?李얠쓣 ???놁뒿?덈떎.");
        return;
      }

      const { data, error: updateError } = await updateNote(
        supabase,
        user.id,
        note.id,
        buildNoteUpdate(values),
      );

      if (updateError) {
        setError(updateError.message);
        return;
      }

      router.replace(`/notes/${data.id}`);
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
            ?명듃 ???            <select
              className="mt-1 w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-3 text-base"
              onChange={(event) =>
                updateField("note_type", event.target.value as NoteType)
              }
              value={values.note_type}
            >
              {noteTypeConfigs.map((config) => (
                <option key={config.type} value={config.type}>
                  {config.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            ?좎쭨
            <input
              className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("entry_date", event.target.value)}
              type="date"
              value={values.entry_date}
            />
          </label>
        </div>
        <p className="mt-3 text-sm leading-6 text-[#6B7280]">
          {selectedConfig.description}
        </p>
      </div>

      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            ?쒕ぉ
            <input
              className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("title", event.target.value)}
              required
              value={values.title}
            />
          </label>
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            ?붿빟
            <textarea
              className="mt-1 min-h-28 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("content", event.target.value)}
              required
              value={values.content}
            />
          </label>
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            ?쒓렇
            <input
              className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("tags", event.target.value)}
              placeholder="?쇳몴濡?援щ텇"
              value={values.tags}
            />
          </label>
        </div>
      </div>

      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-base font-bold text-[#1F2F5C]">
          {selectedConfig.label} ?낅젰 ??ぉ
        </h2>
        <div className="mt-3 space-y-3">
          {selectedConfig.fields.map((field) => {
            const value = values.fields[field.name] ?? "";

            if (field.kind === "textarea") {
              return (
                <label className="block text-sm font-semibold text-[#1F2F5C]" key={field.name}>
                  {field.label}
                  <textarea
                    className="mt-1 min-h-24 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
                    onChange={(event) => updateCustomField(field.name, event.target.value)}
                    required={field.required}
                    value={value}
                  />
                </label>
              );
            }

            if (field.kind === "select") {
              return (
                <label className="block text-sm font-semibold text-[#1F2F5C]" key={field.name}>
                  {field.label}
                  <select
                    className="mt-1 w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-3 text-base"
                    onChange={(event) => updateCustomField(field.name, event.target.value)}
                    required={field.required}
                    value={value}
                  >
                    <option value="">?좏깮</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              );
            }

            return (
              <label className="block text-sm font-semibold text-[#1F2F5C]" key={field.name}>
                {field.label}
                <input
                  className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
                  onChange={(event) => updateCustomField(field.name, event.target.value)}
                  required={field.required}
                  type={field.kind === "number" ? "number" : "text"}
                  value={value}
                />
              </label>
            );
          })}
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
