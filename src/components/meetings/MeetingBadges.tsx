export function ReflectedBadge({ reflected }: { reflected: boolean }) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-medium ${
        reflected ? "border-[#c1e1f7] bg-white text-[#0c0a09]" : "border-[#d6d3d1] bg-[#fafaf9] text-[#78716c]"
      }`}
    >
      {reflected ? "Reflected" : "Open"}
    </span>
  );
}
