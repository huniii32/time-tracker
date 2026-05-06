import { HomeDashboard } from "@/components/home/HomeDashboard";
import { AppShell } from "@/components/layout/AppShell";

export default function HomePage() {
  return (
    <AppShell eyebrow="Time Tracker" title="대시보드">
      <HomeDashboard />
    </AppShell>
  );
}
