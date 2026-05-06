import { AppShell } from "@/components/layout/AppShell";
import { EditReflectionLoader } from "@/components/reflections/EditReflectionLoader";

export default function EditReflectionPage() {
  return (
    <AppShell eyebrow="회고" title="회고 수정">
      <EditReflectionLoader />
    </AppShell>
  );
}
