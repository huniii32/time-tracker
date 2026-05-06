import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { ReflectionsList } from "@/components/reflections/ReflectionsList";

export default function ReflectionsPage() {
  return (
    <AppShell eyebrow="회고" title="하루 회고">
      <div className="space-y-4">
        <div className="flex items-center justify-end">
          <Link
            className="rounded-xl bg-[#0B1F4D] px-4 py-3 text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(11,31,77,0.18)]"
            href="/reflections/new"
          >
            회고 작성
          </Link>
        </div>
        <ReflectionsList />
      </div>
    </AppShell>
  );
}
