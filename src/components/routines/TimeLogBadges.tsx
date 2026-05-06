import type { TimeLogCategory } from "@/types";
import { getTimeLogCategoryLabel } from "@/lib/routines/timeLogs";

export function TimeLogCategoryBadge({ category }: { category: TimeLogCategory }) {
  return (
    <span className="rounded bg-[#EAF1FF] px-2 py-1 text-xs font-semibold text-[#1F2F5C]">
      {getTimeLogCategoryLabel(category)}
    </span>
  );
}
