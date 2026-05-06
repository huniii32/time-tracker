import { AppShell } from "@/components/layout/AppShell";
import { ReflectionDetail } from "@/components/reflections/ReflectionDetail";

export default function ReflectionDetailPage() {
  return (
    <AppShell eyebrow="회고" title="회고 상세">
      <ReflectionDetail />
    </AppShell>
  );
}
