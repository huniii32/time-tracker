import { AppShell } from "@/components/layout/AppShell";
import { NoteForm } from "@/components/notes/NoteForm";

export default function NewNotePage() {
  return (
    <AppShell eyebrow="노트 작성" title="새 노트">
      <NoteForm mode="create" />
    </AppShell>
  );
}
