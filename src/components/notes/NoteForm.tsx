"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { createNote, updateNote } from "@/lib/queries/notes";
import { getNoteTypeConfig, noteTypeConfigs } from "@/lib/notes/config";
import {
  buildNoteInsert,
  buildNoteUpdate,
  getInitialNoteFormValues,
  type NoteFormValues,
  type NoteImage,
} from "@/lib/notes/form";
import type { Note, NoteType } from "@/types";

type NoteFormProps = {
  note?: Note;
  mode: "create" | "edit";
};

const imageEnabledNoteTypes: NoteType[] = [
  "company",
  "manager",
  "dictionary",
  "coworker",
  "learning",
];

const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp"];

export function NoteForm({ mode, note }: NoteFormProps) {
  const router = useRouter();
  const initialValues = useMemo(() => getInitialNoteFormValues(note), [note]);
  const [values, setValues] = useState<NoteFormValues>(initialValues);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<NoteImage | null>(null);
  const imagePreviewUrlsRef = useRef<string[]>([]);
  const selectedConfig = getNoteTypeConfig(values.note_type);
  const canAttachImages = imageEnabledNoteTypes.includes(values.note_type);

  useEffect(() => {
    return () => {
      imagePreviewUrlsRef.current.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
    };
  }, []);

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

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const validFiles = files.filter((file) => acceptedImageTypes.includes(file.type));

    if (files.length !== validFiles.length) {
      setError("jpg, jpeg, png, webp 형식의 이미지만 첨부할 수 있습니다.");
    }

    if (validFiles.length === 0) {
      event.target.value = "";
      return;
    }

    const nextImages = validFiles.map<NoteImage>((file) => {
      const previewUrl = URL.createObjectURL(file);
      imagePreviewUrlsRef.current.push(previewUrl);

      return {
        id: crypto.randomUUID(),
        fileName: file.name,
        previewUrl,
        description: "",
        createdAt: new Date().toISOString(),
      };
    });

    setValues((current) => ({
      ...current,
      images: [...current.images, ...nextImages],
    }));
    event.target.value = "";
  }

  function handleImageRemove(imageId: string) {
    setValues((current) => {
      const removedImage = current.images.find((image) => image.id === imageId);

      if (removedImage) {
        URL.revokeObjectURL(removedImage.previewUrl);
        imagePreviewUrlsRef.current = imagePreviewUrlsRef.current.filter(
          (previewUrl) => previewUrl !== removedImage.previewUrl,
        );
      }

      return {
        ...current,
        images: current.images.filter((image) => image.id !== imageId),
      };
    });

    setPreviewImage((current) => (current?.id === imageId ? null : current));
  }

  function handleImagePreview(image: NoteImage) {
    setPreviewImage(image);
  }

  function handleImageDescriptionChange(imageId: string, description: string) {
    setValues((current) => ({
      ...current,
      images: current.images.map((image) =>
        image.id === imageId ? { ...image, description } : image,
      ),
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
        setError("저장할 노트 정보가 없습니다.");
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
            노트 유형
            <select
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
            작성일
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
            제목
            <input
              className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("title", event.target.value)}
              required
              value={values.title}
            />
          </label>
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            내용
            <textarea
              className="mt-1 min-h-28 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("content", event.target.value)}
              required
              value={values.content}
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

      {canAttachImages ? (
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-[#1F2F5C]">이미지 첨부</h2>
              <p className="mt-1 text-sm text-[#6B7280]">
                업무 화면, 회의 자료, 학습 이미지 등을 첨부해보세요.
              </p>
            </div>
            <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-[#1F2F5C] px-4 py-3 text-sm font-bold text-white shadow-sm">
              이미지 추가
              <input
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                aria-label="이미지 추가"
                className="sr-only"
                multiple
                onChange={handleImageUpload}
                type="file"
              />
            </label>
          </div>

          {values.images.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-6 text-center text-sm text-[#6B7280]">
              업무 화면, 회의 자료, 학습 이미지 등을 첨부해보세요.
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {values.images.map((image) => (
                <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-3" key={image.id}>
                  <div className="relative">
                    <button
                      aria-label={`${image.fileName} 이미지 삭제`}
                      className="absolute right-2 top-2 rounded-full bg-[#0B1F4D] px-2 py-1 text-xs font-bold text-white shadow-sm"
                      onClick={() => handleImageRemove(image.id)}
                      type="button"
                    >
                      삭제
                    </button>
                    <button
                      className="block w-full"
                      onClick={() => handleImagePreview(image)}
                      type="button"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt={image.description || image.fileName}
                        className="h-40 w-full rounded-lg object-cover"
                        src={image.previewUrl}
                      />
                    </button>
                  </div>
                  <p className="mt-2 truncate text-xs font-semibold text-[#374151]">
                    {image.fileName}
                  </p>
                  <input
                    className="mt-2 w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm"
                    onChange={(event) =>
                      handleImageDescriptionChange(image.id, event.target.value)
                    }
                    placeholder="이미지 설명을 입력하세요"
                    value={image.description}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-base font-bold text-[#1F2F5C]">
          {selectedConfig.label} 추가 정보
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
                    <option value="">선택</option>
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

      {previewImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1F4D]/80 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between gap-3 border-b border-[#E5E7EB] px-4 py-3">
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold text-[#1F2F5C]">
                  {previewImage.fileName}
                </h2>
                {previewImage.description ? (
                  <p className="mt-1 text-xs text-[#6B7280]">{previewImage.description}</p>
                ) : null}
              </div>
              <button
                className="rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm font-bold text-[#1F2F5C]"
                onClick={() => setPreviewImage(null)}
                type="button"
              >
                닫기
              </button>
            </div>
            <div className="bg-[#F8FAFC] p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={previewImage.description || previewImage.fileName}
                className="max-h-[72vh] w-full rounded-lg object-contain"
                src={previewImage.previewUrl}
              />
            </div>
          </div>
        </div>
      ) : null}
    </form>
  );
}
