import type { NoteType } from "@/types";
import { getNoteTypeLabel } from "@/lib/notes/config";

type NoteTypeBadgeProps = {
  noteType: NoteType;
};

export function NoteTypeBadge({ noteType }: NoteTypeBadgeProps) {
  return (
    <span className="inline-flex rounded bg-[#F7F8FA] px-2 py-1 text-xs font-semibold text-[#C92735]">
      {getNoteTypeLabel(noteType)}
    </span>
  );
}
