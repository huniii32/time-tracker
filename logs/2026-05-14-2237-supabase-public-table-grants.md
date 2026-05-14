# 작업 로그: Supabase public table grants

## 작업 목표

Supabase Data API 변경에 대비해 public schema user-owned table에 명시적 GRANT를 추가한다.

## 구현한 것

- `supabase/migrations` 전체 SQL migration 점검
- public schema 생성 테이블 확인
- RLS enable 및 `auth.uid() = user_id` 기반 policy 유지 여부 확인
- user-owned table에 anon GRANT가 없는지 확인
- 누락된 CRUD GRANT를 보완하는 신규 migration 추가
- anon에는 권한을 부여하지 않고, 명시적으로 table 권한을 revoke하도록 구성

## 구현하지 않은 것

- DB schema, column name, id default, RLS policy 의도 변경
- TypeScript/Supabase query 로직 변경
- 실제 원격 Supabase DB에 migration 적용
- 실제 DB 연결 기반 CRUD 실행

## 생성한 파일

- `supabase/migrations/202605142235_public_table_api_grants.sql`
- `logs/2026-05-14-2237-supabase-public-table-grants.md`

## 수정한 파일

- 없음

## 실행한 검증

```text
rg "create table if not exists public\." supabase\migrations
rg "grant select, insert, update, delete|revoke all on table" supabase\migrations
rg "grant .* anon|to anon" supabase\migrations
rg "alter table public\..*enable row level security|auth\.uid\(\) = user_id" supabase\migrations
rg "supabase[.]from|client[.]from" src\app src\components
npm.cmd run typecheck
npm.cmd run lint
git -c safe.directory=C:/huniii/test/time-tracker status --short
```

## 검증 결과

- TypeScript: 통과
- Lint: 통과
- `src/app`, `src/components` 직접 `.from(...)` 호출: 없음
- anon GRANT 검색: 없음
- user-owned table RLS/policy 패턴 확인됨
- 새 migration에서 authenticated/service_role CRUD GRANT 확인됨

## 범위 초과 여부

- 범위 초과 없음
- 권한 보완 migration만 추가

## 현재 한계

- 원격 Supabase DB에 직접 연결하지 않아 실제 CRUD 실행은 정적 검증과 query layer 보존 확인으로 대체했다.
- `attachments` 테이블은 현재 migration에 존재하지 않아 GRANT 대상에 포함하지 않았다.
- 작업 전부터 UI 리뉴얼 관련 변경 파일이 worktree에 남아 있다.

## 다음 추천 작업

- 로컬 또는 Supabase 환경에서 migration 적용 후 인증 사용자로 주요 CRUD smoke test 수행
