import { AppShell } from "@/components/layout/AppShell";
import { SettingsForm } from "@/components/settings/SettingsForm";

export default function SettingsPage() {
  return (
    <AppShell eyebrow="Time Tracker" title="Settings">
      <div className="mx-auto max-w-4xl space-y-5">
        <div className="rounded-[2rem] border border-[#E3E8F2] bg-[#0B1F4D] p-5 text-white shadow-[0_22px_50px_rgba(11,31,77,0.18)] sm:p-7">
          <p className="text-sm font-bold text-[#BFD0FF]">Time Tracker Settings</p>
          <h2 className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">
            나에게 맞는 기준값을 설정하세요.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#D7E2FF]">
            입사일, 목표 기록 시간, 주간 기준 요일을 관리해 홈 대시보드와 기록 요약에 반영합니다.
          </p>
        </div>
        <SettingsForm />
      </div>
    </AppShell>
  );
}
