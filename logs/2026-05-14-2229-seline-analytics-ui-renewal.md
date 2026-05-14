# 작업 로그: Seline Analytics UI renewal

## 작업 목표

Dashboard, Notes, Tasks, Meetings, Routines, Reflections 화면을 Seline Analytics 스타일의 light, airy, compact dashboard UI로 정리한다.

## 구현한 것

- 공통 UI 컴포넌트 추가: PageShell, PageHeader, DashboardCard, MetricCard, PrimaryButton, GhostButton, AppInput, AppTextarea, Pill, EmptyState
- 전역 배경, 표면, 텍스트, border, accent 토큰을 새 디자인 기준으로 조정
- AppShell, Header, BottomNav, WorkTabs, RoutineTabs를 새 팔레트와 radius 기준으로 정리
- Dashboard를 metric card, recent card, compact summary 중심으로 재구성
- Notes 목록을 검색 가능한 card grid로 변경
- Tasks 목록을 summary metrics, status filter, status pill 기반 list로 변경
- Meetings 목록을 summary metrics, reflected filter, decision/action item 영역이 있는 list로 변경
- Routines 목록을 weekly rhythm/calendar card와 active routine check list 중심으로 정리
- Reflections 목록을 today reflection prompt, history/guide card 구조로 변경
- 기존 CRUD query 함수, Supabase client 구조, DB schema, RLS policy는 변경하지 않음

## 구현하지 않은 것

- DB schema 변경
- RLS policy 변경
- Supabase Storage, 외부 캘린더, AI, 차트 추가
- 신규 라이브러리 추가
- Codex 환경에서 build 실행

## 생성한 파일

- `src/components/common/ui.tsx`
- `logs/2026-05-14-2229-seline-analytics-ui-renewal.md`

## 수정한 파일

- `src/app/globals.css`
- `src/app/page.tsx`
- `src/app/notes/page.tsx`
- `src/app/tasks/page.tsx`
- `src/app/meetings/page.tsx`
- `src/app/routines/page.tsx`
- `src/app/reflections/page.tsx`
- `src/components/common/Card.tsx`
- `src/components/common/PlaceholderPanel.tsx`
- `src/components/home/HomeDashboard.tsx`
- `src/components/layout/AppShell.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/BottomNav.tsx`
- `src/components/layout/SignOutButton.tsx`
- `src/components/layout/WorkTabs.tsx`
- `src/components/notes/*`
- `src/components/tasks/*`
- `src/components/meetings/*`
- `src/components/reflections/*`
- `src/components/routines/RoutineTabs.tsx`
- `src/components/routines/TimeLogsList.tsx`
- `src/components/routines/RoutineProgressSummary.tsx`

## 실행한 검증

```text
npm.cmd run typecheck
npm.cmd run lint
rg "supabase[.]from|client[.]from" src\app src\components
git -c safe.directory=C:/huniii/test/time-tracker diff --stat
git -c safe.directory=C:/huniii/test/time-tracker status --short
```

## 검증 결과

- TypeScript: 통과
- Lint: 통과
- `src/app`, `src/components` 내 직접 `.from(...)` 호출: 없음
- Build: Codex 환경에서는 실행하지 않는 프로젝트 지침에 따라 미실행

## 범위 초과 여부

- 범위 초과 없음
- UI 리뉴얼과 공통 컴포넌트 정리에 한정
- 데이터 fetch/create/update/delete 흐름은 보존

## 현재 한계

- Codex 환경에서는 `npm run build`를 실행하지 않았다.
- 브라우저에서 실제 모바일/데스크톱 렌더링까지 수동 확인하지는 못했다.

## 다음 추천 작업

- 사용자 로컬 환경에서 `npm run build` 실행
- 브라우저에서 Dashboard, Notes, Tasks, Meetings, Routines, Reflections 주요 CRUD 화면 수동 확인
