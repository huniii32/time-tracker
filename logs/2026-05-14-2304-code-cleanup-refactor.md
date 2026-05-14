# 작업 로그: Code cleanup refactor

## 작업 목표

Seline Analytics 스타일 UI 리뉴얼 이후 공통 UI 구조를 정리하고 dead code를 제거한다.

## 제거한 파일

- `src/components/common/PlaceholderPanel.tsx`
  - `src` 내부 실제 참조가 없어 제거했다.

## 수정한 파일

- `src/components/common/Card.tsx`
  - 기존 `Card`를 `DashboardCard` 호환 wrapper로 유지해 기존 호출부를 보존했다.
- `src/components/common/ui/page-shell.tsx`
- `src/components/common/ui/page-header.tsx`
- `src/components/common/ui/dashboard-card.tsx`
- `src/components/common/ui/metric-card.tsx`
- `src/components/common/ui/primary-button.tsx`
- `src/components/common/ui/ghost-button.tsx`
- `src/components/common/ui/app-input.tsx`
- `src/components/common/ui/app-textarea.tsx`
- `src/components/common/ui/pill.tsx`
- `src/components/common/ui/empty-state.tsx`
- `src/components/common/ui/index.ts`

## 통합한 컴포넌트

- `src/components/common/ui.tsx` 단일 파일을 `src/components/common/ui/*` 구조로 분리했다.
- 기존 import 경로 `@/components/common/ui`는 `index.ts` barrel export로 유지했다.
- `MetricCard`는 기존 호출부의 `detail` prop과 새 `helper` prop을 모두 지원하도록 유지했다.
- `EmptyState`는 기존 호출부의 optional `description`, `action` 사용을 유지했다.

## 변경하지 않은 영역

- Supabase client 구조
- query layer 동작
- DB schema
- Supabase migrations
- RLS policy
- 인증/권한 로직
- 신규 기능 및 신규 라이브러리

## 실행한 검증 명령어

```text
rg "PlaceholderPanel|components/common/PlaceholderPanel" src
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
cmd /c "set NEXT_TELEMETRY_DISABLED=1&& npm.cmd run build"
rg "supabase[.]from|client[.]from" src/app src/components
rg "TODO|FIXME|console.log" src
git -c safe.directory=C:/huniii/test/time-tracker diff --stat
git -c safe.directory=C:/huniii/test/time-tracker status --short
```

## 검증 결과

- TypeScript: 통과
- Lint: 통과
- 직접 Supabase table query 검색: 발견 없음
- TODO/FIXME/console.log 검색: 발견 없음
- `PlaceholderPanel` 참조 검색: 발견 없음
- Build: 완료하지 못함
  - sandbox 내부에서 `next build`가 설정 로드 직후 멈춰 180초, 600초, 240초 제한 시간에 각각 timeout 됐다.
  - 외부 권한 build 실행은 승인되지 않아 추가 확인하지 못했다.

## 남은 리스크

- `npm run build`가 Codex sandbox에서 timeout되어 빌드 완료 여부를 최종 확인하지 못했다.
- 현재 worktree에는 이번 cleanup 전 UI 리뉴얼 및 Supabase GRANT migration 변경이 함께 남아 있다.

## 다음 추천 작업

- 로컬 환경에서 `npm run build`를 직접 실행해 Next.js production build 완료 여부를 확인한다.
- 빌드가 로컬에서도 멈추면 Next.js build 프로세스가 설정 로드 이후 어디에서 대기하는지 별도 진단한다.
