import Link from "next/link";
import { PrimaryButton } from "@/components/common/ui";
import { AppShell } from "@/components/layout/AppShell";
import { ReflectionsList } from "@/components/reflections/ReflectionsList";

export default function ReflectionsPage() {
  return (
    <AppShell eyebrow="회고" title="하루 회고">
      <div className="space-y-4">
        <div className="flex items-center justify-end">
          <Link href="/reflections/new">
            <PrimaryButton>회고 작성</PrimaryButton>
          </Link>
        </div>
        <ReflectionsList />
      </div>
    </AppShell>
  );
}
