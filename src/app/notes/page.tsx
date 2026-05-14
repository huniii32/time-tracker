import Link from "next/link";
import { PrimaryButton } from "@/components/common/ui";
import { AppShell } from "@/components/layout/AppShell";
import { NotesList } from "@/components/notes/NotesList";

export default function NotesPage() {
  return (
    <AppShell eyebrow="Time Tracker" title="노트">
      <div className="space-y-4">
        <div className="flex items-center justify-end">
          <Link href="/notes/new">
            <PrimaryButton>새 노트</PrimaryButton>
          </Link>
        </div>
        <NotesList />
      </div>
    </AppShell>
  );
}
