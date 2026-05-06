export function ReflectedBadge({ reflected }: { reflected: boolean }) {
  return (
    <span
      className={`rounded px-2 py-1 text-xs font-semibold ${
        reflected ? "bg-[#ECFDF3] text-[#067647]" : "bg-[#FEF2F2] text-[#C92735]"
      }`}
    >
      {reflected ? "반영 완료" : "미반영"}
    </span>
  );
}
