import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { NotesList } from "@/components/notes/NotesList";

export default function NotesPage() {
  return (
    <AppShell eyebrow="Time Tracker" title="노트">
      <div className="space-y-4">
        <div className="flex items-center justify-end">
          <Link
            className="rounded-xl bg-[#0B1F4D] px-4 py-3 text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(11,31,77,0.18)]"
            href="/notes/new"
          >
            새 노트
          </Link>
        </div>
        <NotesList />
      </div>
    </AppShell>
  );
}
