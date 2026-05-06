export default function GuidePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Time Tracker 설명서</h1>
          <p className="mt-2 text-lg text-slate-600">
            회사 적응기(Onboarding Tracker)는 개인용 회사 적응 기록 웹앱입니다.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold text-slate-900">앱의 목적</h2>
          <p className="mt-2 text-slate-600">
            사용자가 로그인한 뒤 회사 문화, 업무, 루틴, 회고를 단계적으로 기록하고 관리할 수 있게 만든 생산성 앱입니다.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-900">홈 대시보드 의미</h2>
          <p className="mt-2 text-slate-600">
            홈 대시보드는 전체 앱의 진입점으로, 주요 기능의 요약과 최근 활동을 한눈에 볼 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-900">노트 사용법</h2>
          <p className="mt-2 text-slate-600">
            노트는 일상적인 메모와 아이디어를 기록하는 공간입니다. 새로운 노트를 작성하고, 기존 노트를 편집하거나 삭제할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-900">업무 사용법</h2>
          <p className="mt-2 text-slate-600">
            업무는 할 일 목록을 관리하는 기능입니다. 업무를 추가, 완료 표시, 수정, 삭제할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-900">미팅 사용법</h2>
          <p className="mt-2 text-slate-600">
            미팅은 회의 내용을 기록하고 관리하는 기능입니다. 미팅 일정, 참석자, 내용을 기록할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-900">루틴 사용법</h2>
          <p className="mt-2 text-slate-600">
            루틴은 일일 시간 로그, 주간 피드백, 목표 설정을 포함한 습관 형성 도구입니다.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-900">회고 사용법</h2>
          <p className="mt-2 text-slate-600">
            회고는 주간 또는 월간 성찰을 기록하는 기능입니다. 지난 기간의 경험을 정리하고 개선점을 기록할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-900">설정 사용법</h2>
          <p className="mt-2 text-slate-600">
            설정에서는 앱의 기본 설정을 변경할 수 있습니다. 프로필 정보, 알림 설정 등을 관리합니다.
          </p>
        </section>
      </div>
    </div>
  );
}