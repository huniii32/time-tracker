import { AppShell } from "@/components/layout/AppShell";
import { EditNoteLoader } from "@/components/notes/EditNoteLoader";

export default function EditNotePage() {
  return (
    <AppShell eyebrow="노트 수정" title="노트">
      <EditNoteLoader />
    </AppShell>
  );
}
