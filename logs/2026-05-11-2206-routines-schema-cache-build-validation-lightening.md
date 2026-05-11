# 작업 로그: Supabase 루틴 테이블 schema cache 에러 수정 및 검증 명령 경량화

## 작업 목표

- 루틴 추가 시 발생한 `Could not find the table 'public.routines' in the schema cache` 원인을 정리하고 migration 보정 파일을 추가한다.
- query layer의 테이블명과 Supabase migration의 테이블명을 `public.routines`, `public.routine_completions` 기준으로 일치시킨다.
- Codex 환경에서 오래 걸리는 build 검증 지시를 제거하고 typecheck/lint 중심으로 검증 기준을 바꾼다.

## 구현한 것

- `public.routines`와 `public.routine_completions`를 보장하는 후속 migration을 추가했다.
- `routine_completions.routine_id`가 `public.routines(id)`를 참조하도록 FK 보정 블록을 추가했다.
- `routines_title_not_empty` 제약, 사용자/active/sort index, 완료 기록 index를 보정했다.
- `set_updated_at` 함수, updated_at trigger, RLS 활성화, 사용자 본인 데이터 기준 policy를 migration에 포함했다.
- query layer에서 사용하는 테이블명이 `routines`, `routine_completions`임을 확인했다.
- `AGENTS.md`, `docs/HARNESS.md`, `docs/TASK_TEMPLATE.md`, `docs/MILESTONES.md`, `docs/ROADMAP.md`에서 Codex가 build를 필수 실행하도록 읽을 수 있는 지시를 제거하거나 로컬/CI 별도 수행 문구로 변경했다.
- `package.json`의 `build` script는 유지했다.

## 구현하지 않은 것

- 실제 Supabase production DB reset
- `supabase db reset` 실행
- 인증 구조 변경
- Supabase client 초기화 구조 변경
- 루틴 화면 UI 리디자인
- package dependency 변경

## 생성한 파일

- `supabase/migrations/202605112155_ensure_routines_schema_cache_fix.sql`
- `logs/2026-05-11-2206-routines-schema-cache-build-validation-lightening.md`

## 수정한 파일

- `AGENTS.md`
- `docs/HARNESS.md`
- `docs/MILESTONES.md`
- `docs/ROADMAP.md`
- `docs/TASK_TEMPLATE.md`

## 실행한 검증

- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `rg 'supabase[.]from|client[.]from' src/app src/components`
- `rg --% "from\(\"routines\"\)|from\(\"routine_completions\"\)" src`
- `rg "create table.*routines|public.routines|routine_completions" supabase`
- `rg "npm run build|next build|npx next build|npm exec next build" AGENTS.md docs`
- `rg "빌드가 통과한다|TODO: build command" AGENTS.md docs`
- `git -c safe.directory=C:/huniii/test/time-tracker diff --stat`
- `git -c safe.directory=C:/huniii/test/time-tracker status --short`

## 검증 결과

- `npm.cmd run typecheck`: 통과
- `npm.cmd run lint`: 통과
- `rg 'supabase[.]from|client[.]from' src/app src/components`: 결과 없음
- `rg --% "from\(\"routines\"\)|from\(\"routine_completions\"\)" src`: query layer의 `routines`, `routine_completions` 호출 확인
- `rg "create table.*routines|public.routines|routine_completions" supabase`: 기존 migration과 보정 migration에서 테이블, FK, RLS, policy 확인
- `rg "npm run build|next build|npx next build|npm exec next build" AGENTS.md docs`: 결과 없음
- `rg "빌드가 통과한다|TODO: build command" AGENTS.md docs`: 결과 없음
- `git diff --stat`: 문서 5개 변경 확인
- `git status --short`: 문서 5개 수정, 신규 migration 1개 확인

## 범위 초과 여부

- 범위 초과 없음.
- package script와 dependency는 변경하지 않았다.
- 기존 루틴 UI/인증/Supabase client 구조는 변경하지 않았다.

## 현재 한계

- migration 파일 생성만으로 실제 Supabase DB에 자동 적용되지는 않는다.
- 루틴 추가 기능이 정상 동작하려면 실제 Supabase DB에 migration을 적용해야 한다.
- `README.md`, 루트 `TASK_TEMPLATE.md`, 루트 `PROMPT_TEMPLATE.md`는 현재 저장소에 없어 검사 대상에서 제외했다.
- Codex 환경 정책에 따라 build는 실행하지 않았다.

## Supabase에 실제 적용해야 하는 명령

```text
supabase db push
```

또는 Supabase SQL Editor에서 아래 파일의 SQL을 실행한다.

```text
supabase/migrations/202605112155_ensure_routines_schema_cache_fix.sql
```

## 다음 추천 작업

- Supabase migration을 실제 프로젝트 DB에 적용한다.
- 브라우저에서 루틴 추가/수정/삭제를 확인한다.
- 루틴 체크/해제 후 새로고침 유지 여부를 확인한다.
- 배포 전 사용자가 로컬 또는 CI에서 build를 별도로 수행한다.
