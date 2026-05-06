"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/common/Card";
import { deleteNote, getNote } from "@/lib/queries/notes";
import { getNoteTypeConfig } from "@/lib/notes/config";
import { getJsonRecord } from "@/lib/notes/form";
import { createClient } from "@/lib/supabase/browser";
import type { Note } from "@/types";
import { NoteTypeBadge } from "./NoteTypeBadge";

export function NoteDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadNote() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data, error: noteError } = await getNote(supabase, user.id, params.id);

      if (noteError) {
        setError(noteError.message);
      } else {
        setNote(data);
      }

      setLoading(false);
    }

    void loadNote();
  }, [params.id, router]);

  async function handleDelete() {
    if (!note || !confirm("이 노트를 삭제할까요?")) {
      return;
    }

    setDeleting(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const { error: deleteError } = await deleteNote(supabase, user.id, note.id);

    if (deleteError) {
      setError(deleteError.message);
      setDeleting(false);
      return;
    }

    router.replace("/notes");
    router.refresh();
  }

  if (loading) {
    return <Card>노트를 불러오는 중입니다.</Card>;
  }

  if (!note) {
    return (
      <Card>
        <h2 className="font-semibold text-[#1F2F5C]">노트를 찾을 수 없습니다.</h2>
        {error ? <p className="mt-2 text-sm text-[#C92735]">{error}</p> : null}
      </Card>
    );
  }

  const config = getNoteTypeConfig(note.note_type);
  const fields = getJsonRecord(note.fields);

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <NoteTypeBadge noteType={note.note_type} />
            <h2 className="mt-2 text-2xl font-bold text-[#1F2F5C]">{note.title}</h2>
          </div>
          <span className="shrink-0 text-xs text-[#6B7280]">
            {note.entry_date ?? note.created_at.slice(0, 10)}
          </span>
        </div>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-[#374151]">
          {note.content}
        </p>
        {note.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <span className="rounded bg-[#F7F8FA] px-2 py-1 text-xs" key={tag}>
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </Card>

      <Card>
        <h2 className="font-semibold text-[#1F2F5C]">{config.label} 상세 항목</h2>
        <dl className="mt-3 space-y-3">
          {config.fields.map((field) => (
            <div key={field.name}>
              <dt className="text-xs font-semibold text-[#6B7280]">{field.label}</dt>
              <dd className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#111827]">
                {fields[field.name] || "-"}
              </dd>
            </div>
          ))}
        </dl>
      </Card>

      {error ? <p className="text-sm text-[#C92735]">{error}</p> : null}

      <div className="grid grid-cols-2 gap-3">
        <Link
          className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-center text-sm font-bold text-[#1F2F5C]"
          href={`/notes/${note.id}/edit`}
        >
          수정
        </Link>
        <button
          className="rounded-lg bg-[#C92735] px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
          disabled={deleting}
          onClick={() => void handleDelete()}
          type="button"
        >
          {deleting ? "삭제 중" : "삭제"}
        </button>
      </div>
    </div>
  );
}
