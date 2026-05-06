"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/common/Card";
import { getNote } from "@/lib/queries/notes";
import { createClient } from "@/lib/supabase/browser";
import type { Note } from "@/types";
import { NoteForm } from "./NoteForm";

export function EditNoteLoader() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) {
    return <Card>노트를 불러오는 중입니다.</Card>;
  }

  if (!note) {
    return (
      <Card>
        <h2 className="font-semibold text-[#1F2F5C]">수정할 노트를 찾을 수 없습니다.</h2>
        {error ? <p className="mt-2 text-sm text-[#C92735]">{error}</p> : null}
      </Card>
    );
  }

  return <NoteForm mode="edit" note={note} />;
}
