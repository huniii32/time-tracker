import { AppShell } from "@/components/layout/AppShell";
import { ReflectionForm } from "@/components/reflections/ReflectionForm";

export default function NewReflectionPage() {
  return (
    <AppShell eyebrow="회고" title="새 회고">
      <ReflectionForm mode="create" />
    </AppShell>
  );
}
