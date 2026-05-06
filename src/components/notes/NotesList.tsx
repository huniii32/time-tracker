"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/common/Card";
import { listNotes } from "@/lib/queries/notes";
import { createClient } from "@/lib/supabase/browser";
import { noteTypeConfigs } from "@/lib/notes/config";
import type { Note, NoteType } from "@/types";
import { NoteTypeBadge } from "./NoteTypeBadge";

export function NotesList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<NoteType | "all">("all");

  useEffect(() => {
    async function loadNotes() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      const { data, error: listError } = await listNotes(supabase, user.id);

      if (listError) {
        setError(listError.message);
      } else {
        setNotes(data ?? []);
      }

      setLoading(false);
    }

    void loadNotes();
  }, []);

  const filteredNotes = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return notes.filter((note) => {
      const typeMatches = typeFilter === "all" || note.note_type === typeFilter;
      const searchMatches =
        !keyword ||
        note.title.toLowerCase().includes(keyword) ||
        note.content.toLowerCase().includes(keyword) ||
        note.tags.some((tag) => tag.toLowerCase().includes(keyword));

      return typeMatches && searchMatches;
    });
  }, [notes, search, typeFilter]);

  if (loading) {
    return <Card>노트를 불러오는 중입니다.</Card>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm">
        <div className="space-y-3">
          <input
            className="w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="제목, 내용, 태그 검색"
            value={search}
          />
          <select
            className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-3 text-base"
            onChange={(event) => setTypeFilter(event.target.value as NoteType | "all")}
            value={typeFilter}
          >
            <option value="all">전체 노트</option>
            {noteTypeConfigs.map((config) => (
              <option key={config.type} value={config.type}>
                {config.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error ? <p className="text-sm text-[#C92735]">{error}</p> : null}

      {filteredNotes.length === 0 ? (
        <Card>
          <h2 className="font-semibold text-[#1F2F5C]">아직 노트가 없습니다.</h2>
          <p className="mt-2 text-sm text-[#6B7280]">
            회사 적응 과정에서 관찰한 내용을 첫 노트로 남겨보세요.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotes.map((note) => (
            <Link className="block" href={`/notes/${note.id}`} key={note.id}>
              <Card>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <NoteTypeBadge noteType={note.note_type} />
                    <h2 className="mt-2 text-lg font-bold text-[#1F2F5C]">{note.title}</h2>
                  </div>
                  <span className="shrink-0 text-xs text-[#6B7280]">
                    {note.entry_date ?? note.created_at.slice(0, 10)}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6B7280]">
                  {note.content}
                </p>
                {note.tags.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {note.tags.map((tag) => (
                      <span className="rounded bg-[#F7F8FA] px-2 py-1 text-xs" key={tag}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
