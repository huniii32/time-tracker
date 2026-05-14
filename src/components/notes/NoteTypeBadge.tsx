import type { NoteType } from "@/types";
import { getNoteTypeLabel } from "@/lib/notes/config";

type NoteTypeBadgeProps = {
  noteType: NoteType;
};

export function NoteTypeBadge({ noteType }: NoteTypeBadgeProps) {
  return (
    <span className="inline-flex rounded-full border border-[#e5e7eb] bg-white px-3 py-1 text-xs font-medium text-[#78716c]">
      {getNoteTypeLabel(noteType)}
    </span>
  );
}
