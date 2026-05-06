# Milestone 2 DB Column RLS Verification

## 작업명

Milestone 2 DB 적용 후 컬럼명/RLS 검증

## 작업 목표

Supabase migration 적용 후 로컬 migration, TypeScript 타입, query layer, 실제 Supabase REST 테이블 엔드포인트가 서로 일치하는지 검증한다.

## 구현한 것

없음. 이번 작업은 검증만 수행했다.

## 구현하지 않은 것

- 노트 CRUD 화면 구현
- 업무 CRUD 화면 구현
- 미팅 CRUD 화면 구현
- 루틴 CRUD 화면 구현
- 회고 CRUD 화면 구현
- UI 대규모 수정
- 차트
- AI 기능
- DB schema 변경
- query layer 변경

## 생성한 파일

- `logs/2026-05-05-0448-milestone-2-db-column-rls-verification.md`

## 수정한 파일

없음.

## 실행한 검증

- SQL migration 테이블 컬럼과 `src/types/database.ts` Row 타입 컬럼 비교
- `deadline`, `outcome` 등 불일치 후보 검색
- `due_date`, `output`, `goal_type`, `goal_level`, `linked_task_id`, `linked_note_id` 사용 위치 확인
- migration 내 `user_id` 컬럼 존재 확인
- migration 내 RLS enable 및 ownership policy 확인
- Supabase REST API로 8개 테이블 엔드포인트 접근 확인
- 컴포넌트 내 직접 Supabase table query 검색
- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run build`

## 검증 결과

### 테이블 존재

Supabase REST API 기준 아래 테이블이 모두 `200 OK`를 반환했다.

- `profiles`
- `notes`
- `tasks`
- `meetings`
- `time_logs`
- `weekly_reviews`
- `goals`
- `reflections`

### SQL 컬럼과 TypeScript 타입 일치

로컬 migration SQL과 `src/types/database.ts` Row 타입을 비교했다.

- `profiles`: 일치, 8 columns
- `notes`: 일치, 11 columns
- `tasks`: 일치, 15 columns
- `meetings`: 일치, 13 columns
- `time_logs`: 일치, 13 columns
- `weekly_reviews`: 일치, 14 columns
- `goals`: 일치, 15 columns
- `reflections`: 일치, 12 columns

### 명칭 불일치 확인

- `tasks.due_date`: SQL, TypeScript, query layer에서 일관 사용
- `tasks.output`: SQL, TypeScript에서 일관 사용
- `deadline`: 사용 없음
- `outcome`: 사용 없음
- `goals.goal_type`: SQL, TypeScript, query layer에서 일관 사용
- `goals.goal_level`: SQL, TypeScript, query layer에서 일관 사용
- `goals.linked_task_id`: SQL, TypeScript에서 일관 사용
- `goals.linked_note_id`: SQL, TypeScript에서 일관 사용

### RLS 확인

로컬 migration 기준 아래가 확인되었다.

- 8개 테이블 모두 `enable row level security` 대상에 포함
- 8개 테이블 모두 `user_id` 컬럼 포함
- select policy: `auth.uid() = user_id`
- insert policy: `auth.uid() = user_id`
- update policy: `auth.uid() = user_id`
- delete policy: `auth.uid() = user_id`

주의: anon key로는 Supabase 시스템 카탈로그의 실제 policy 목록을 직접 조회할 수 없어서, 실제 RLS 정책 존재 여부는 적용된 migration SQL 기준으로 검증했다.

### Query Layer 확인

- query layer는 `src/lib/queries` 아래 기능별로 분리되어 있다.
- 조회/수정/삭제 함수는 `.eq("user_id", userId)`를 적용한다.
- 생성 함수는 `user_id: userId`를 payload에 포함한다.
- `src/app`, `src/components` 내 직접 `.from(...)` 호출은 없다.

### 명령 검증

- 타입 체크: 통과
- 린트: 통과
- 빌드: 통과

## 범위 초과 여부

범위 초과 없음. 검증 외 앱 기능 구현이나 UI 변경은 하지 않았다.

## 현재 한계

- 실제 Supabase RLS policy catalog 검증은 service role 또는 SQL editor 접근이 필요하다.
- 현재 검증은 REST 테이블 존재 확인 + migration SQL 정적 검증 + TypeScript/query layer 정합성 검증으로 수행했다.

## 다음 추천 작업

Supabase SQL Editor에서 `pg_policies` 조회로 실제 policy 목록을 한 번 더 확인한 뒤 다음 마일스톤으로 진행한다.
