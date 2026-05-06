# 작업명

Supabase user_settings 테이블 및 RLS 적용 준비

# 작업 목표

Milestone 10 설정 기능 MVP의 `/settings` 페이지가 실제 운영 환경에서 동작하도록 `user_settings` 테이블과 사용자별 RLS 정책 SQL을 적용 가능한 migration으로 정리한다.

# 구현한 것

- `user_settings` 테이블 생성 migration 추가
- `user_id` 기준 unique 제약 추가
- `user_id` 조회용 index 추가
- RLS 활성화 SQL 추가
- 사용자별 select / insert / update / delete 정책 추가
- 기존 `public.set_updated_at()` 함수를 사용하는 `updated_at` 자동 갱신 trigger 추가
- 앱 타입과 일치하도록 `week_starts_on`, `default_start_page` check constraint 추가

# 구현하지 않은 것

- Supabase SQL Editor 직접 실행
- 원격 Supabase DB에 migration 직접 push
- 실제 로그인 계정 `/settings` 저장 테스트
- 새로고침 후 설정값 유지 확인
- 홈 대시보드 반영 수동 확인
- 다른 계정 격리 수동 확인

# 생성한 파일

- `supabase/migrations/202605062200_user_settings_table_rls.sql`
- `logs/2026-05-06-2201-supabase-user-settings-table-rls.md`

# 수정한 파일

- 없음

# DB/RLS 변경 필요 여부

필요함.

이번 작업에서는 원격 Supabase 접근 도구와 Supabase CLI가 없어 실제 DB에는 적용하지 못했다. 아래 migration을 Supabase SQL Editor에서 실행하거나 Supabase CLI가 설정된 환경에서 적용해야 한다.

- `supabase/migrations/202605062200_user_settings_table_rls.sql`

# 실행한 검증

- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run build`
- `rg -n "user_settings|Users can view own settings|enable row level security|unique\(user_id\)" supabase\migrations src`
- `Get-Command supabase -ErrorAction SilentlyContinue`

# 검증 결과

- 타입 체크 통과
- 린트 통과
- 빌드 통과
- 첫 빌드는 PowerShell 샌드박스에서 `spawn EPERM`으로 실패했고, 승인된 외부 실행에서 통과
- migration 파일에 `user_settings` 테이블, `unique(user_id)`, RLS 활성화, 사용자별 정책 포함 확인
- 로컬 환경에서 Supabase CLI 감지되지 않음

# 범위 초과 여부

범위 초과 구현 없음.

# 현재 한계

- 원격 Supabase 프로젝트에 직접 접근할 수 없어 SQL Editor 실행과 실제 계정 기반 저장/격리 검증은 수행하지 못했다.
- migration은 기존 `set_updated_at()` 함수가 이미 적용되어 있다는 전제다. 기존 `202605050426_milestone_2_data_model.sql`에서 해당 함수가 생성되어 있다.

# 다음 추천 작업

Supabase SQL Editor에서 `supabase/migrations/202605062200_user_settings_table_rls.sql` 내용을 실행한 뒤, 실제 계정으로 `/settings` 저장, 새로고침 유지, 홈 반영, 다른 계정 격리를 수동 검증한다.
