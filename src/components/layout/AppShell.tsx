import type { ReactNode } from "react";
import { PageHeader, PageShell } from "@/components/common/ui";
import { BottomNav } from "./BottomNav";
import { Header } from "./Header";

type AppShellProps = {
  children: ReactNode;
  title: string;
  eyebrow?: string;
};

export function AppShell({ children, eyebrow, title }: AppShellProps) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pb-[calc(7.5rem+env(safe-area-inset-bottom))] pt-5">
        <PageShell>
          <PageHeader
            description="입력, 기록, 시간화, 회고를 한 흐름으로 정리합니다."
            eyebrow={eyebrow}
            title={title}
          />
          {children}
        </PageShell>
      </main>
      <BottomNav />
    </div>
  );
}
