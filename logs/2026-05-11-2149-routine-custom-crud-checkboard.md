# 작업 로그: Milestone 10 사용자 정의 루틴 CRUD 및 체크보드 연동

## 작업 목표

- 고정 루틴 목록을 제거하고 사용자별 루틴을 직접 추가, 수정, 삭제할 수 있게 한다.
- 사용자 루틴을 이번 주 루틴 체크보드에 연결한다.
- 루틴 완료 상태를 `routine_id + completion_date` 기준으로 저장하도록 구조를 분리한다.

## 구현한 것

- `routines` 테이블 마이그레이션을 추가했다.
  - 사용자별 루틴 정의 저장
  - `title`, `description`, `category`, `is_active`, `sort_order` 포함
  - `title` 빈 문자열 방지
  - soft delete용 `is_active=false` 구조 적용
- `routine_completions` 테이블 마이그레이션을 추가했다.
  - `routine_id + completion_date` 기준 완료 기록 저장
  - `unique (user_id, routine_id, completion_date)` 적용
  - 기존 루틴명 변경과 완료 상태를 분리
- 두 테이블에 RLS, 사용자별 select/insert/update/delete policy, updated_at trigger, index를 추가했다.
- `src/types/database.ts`, `src/types/domain.ts`, `src/types/index.ts`에 루틴 및 완료 타입을 추가했다.
- `src/lib/routines/routines.ts` query layer를 추가했다.
  - `getUserRoutines`
  - `createRoutine`
  - `updateRoutine`
  - `archiveRoutine`
- `src/lib/routines/routineCompletions.ts` query layer를 추가했다.
  - `getRoutineCompletionsForRange`
  - `setRoutineCompletion`
  - `buildRoutineCompletionMap`
- `TimeLogsList`에서 시간 기록, active 루틴, 이번 주 완료 기록을 함께 조회하도록 연결했다.
- `RoutineProgressSummary`에서 기존 고정 루틴 배열을 제거하고 DB 루틴 목록 기반 체크보드로 변경했다.
- 루틴 추가, 수정, 삭제 UI를 추가했다.
- 루틴 삭제는 실제 delete가 아니라 `is_active=false` archive 처리로 구현했다.
- 빈 상태에서 첫 루틴 추가를 유도하는 UI를 추가했다.
- 체크 토글은 루틴 title이 아니라 `routine.id`와 KST 기준 날짜 key로 처리하도록 변경했다.
- 기존 월간 캘린더와 시간 기록 기반 표시는 유지했다.

## 구현하지 않은 것

- 드래그 앤 드롭 정렬
- 루틴 알림
- 외부 캘린더 연동
- 차트
- AI 추천 루틴
- Supabase Storage
- 인증 구조 변경
- 노트/업무/미팅/회고 기능 변경

## 생성한 파일

- `src/lib/routines/routines.ts`
- `src/lib/routines/routineCompletions.ts`
- `supabase/migrations/202605111020_routines_crud_and_completions.sql`
- `logs/2026-05-11-2149-routine-custom-crud-checkboard.md`

## 수정한 파일

- `src/components/routines/RoutineProgressSummary.tsx`
- `src/components/routines/TimeLogsList.tsx`
- `src/types/database.ts`
- `src/types/domain.ts`
- `src/types/index.ts`

## 실행한 검증

- `npm run typecheck`
- `npx tsc --noEmit --incremental false`
- `npm run lint`
- `npm run build`
- `rg 'supabase[.]from|client[.]from' src/app src/components`
- `rg "create table.*routines|routine_completions|routines" supabase`
- `git diff --stat`
- `git status --short`

## 검증 결과

- `npm run typecheck`: 통과
  - 최초 실행은 PowerShell `npm.ps1` 실행 정책 문제로 실패했다.
  - `npm.cmd run typecheck`는 `tsconfig.tsbuildinfo` 쓰기 권한 문제로 한 번 실패했다.
  - 권한 승인 후 `npm.cmd run typecheck` 통과.
- `npx tsc --noEmit --incremental false`: 통과
- `npm run lint`: 통과
- `npm run build`: 미완료
  - 120초 제한에서 타임아웃.
  - 600초 제한에서도 Next.js 초기 출력 이후 완료되지 않아 타임아웃.
  - telemetry 비활성화 재시도 중 사용자가 작업을 중단했다.
- `rg 'supabase[.]from|client[.]from' src/app src/components`: 결과 없음
- `rg "create table.*routines|routine_completions|routines" supabase`: 신규 migration에서 루틴/완료 구조 확인됨
- `git diff --stat`: 변경 파일 통계 확인됨
- `git status --short`: 변경 파일 목록 확인됨

## 범위 초과 여부

- 범위 초과 없음.
- 요청된 루틴 CRUD, 체크보드 연동, 완료 상태 저장 구조만 구현했다.
- 신규 라이브러리 추가 및 package dependency 변경 없음.

## 현재 한계

- `npm run build`가 완료되지 않아 완료 기준을 모두 충족하지 못했다.
- 실제 Supabase 프로젝트에 migration을 적용한 상태는 아니다.
- 브라우저에서 실제 CRUD 동작을 수동 검증하지 못했다.
- 빌드 타임아웃 원인은 아직 확정하지 못했다.

## 다음 추천 작업

- `npm run build`가 멈추는 원인을 별도 작업으로 확인한다.
- Supabase migration 적용 후 실제 로그인 사용자로 루틴 생성/수정/archive/체크 토글을 수동 검증한다.
- Playwright 기반 루틴 CRUD 및 체크 토글 테스트를 추가한다.
- 이후 범위로 루틴 정렬 기능 또는 카테고리 필터를 검토한다.
