"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppInput, DashboardCard, EmptyState, Pill } from "@/components/common/ui";
import { noteTypeConfigs } from "@/lib/notes/config";
import { listNotes } from "@/lib/queries/notes";
import { createClient } from "@/lib/supabase/browser";
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
        setError("Login is required.");
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
    return <DashboardCard>Loading notes...</DashboardCard>;
  }

  return (
    <div className="space-y-4">
      <DashboardCard className="p-4 sm:p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <AppInput
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title, content, tags"
            value={search}
          />
          <select
            className="w-full rounded-[10px] border border-[#d6d3d1] bg-white px-3 py-2.5 text-sm text-[#0c0a09] focus:border-[#3ba6f1] focus:outline-none focus:ring-2 focus:ring-[#c1e1f7]"
            onChange={(event) => setTypeFilter(event.target.value as NoteType | "all")}
            value={typeFilter}
          >
            <option value="all">All notes</option>
            {noteTypeConfigs.map((config) => (
              <option key={config.type} value={config.type}>
                {config.label}
              </option>
            ))}
          </select>
        </div>
      </DashboardCard>

      {error ? <p className="text-sm text-[#78716c]">{error}</p> : null}

      {filteredNotes.length === 0 ? (
        <DashboardCard>
          <EmptyState
            description="Record work context, company terms, and things you learned."
            title="No notes yet."
          />
        </DashboardCard>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredNotes.map((note) => (
            <Link className="block h-full" href={`/notes/${note.id}`} key={note.id}>
              <DashboardCard className="flex h-full flex-col transition hover:border-[#d6d3d1]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <NoteTypeBadge noteType={note.note_type} />
                    <h2 className="mt-3 line-clamp-2 text-lg font-semibold leading-snug text-[#0c0a09]">
                      {note.title}
                    </h2>
                  </div>
                  <span className="shrink-0 text-xs text-[#78716c]">
                    {note.entry_date ?? note.created_at.slice(0, 10)}
                  </span>
                </div>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#78716c]">{note.content}</p>
                {note.tags.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {note.tags.map((tag) => (
                      <Pill key={tag}>#{tag}</Pill>
                    ))}
                  </div>
                ) : null}
              </DashboardCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
