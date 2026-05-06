import { AppShell } from "@/components/layout/AppShell";
import { NoteDetail } from "@/components/notes/NoteDetail";

export default function NoteDetailPage() {
  return (
    <AppShell eyebrow="노트 상세" title="노트">
      <NoteDetail />
    </AppShell>
  );
}
