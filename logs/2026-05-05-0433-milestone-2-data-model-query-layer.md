# Milestone 2 Data Model Query Layer

## 작업명

Milestone 2: 데이터 모델과 Query Layer

## 작업 목표

Supabase 기반 데이터 모델, RLS 정책, TypeScript 타입, 기능별 query layer 구조를 구축한다. UI CRUD 구현은 제외한다.

## 구현한 것

- `profiles` 데이터 타입
- `notes` 데이터 타입
- `tasks` 데이터 타입
- `meetings` 데이터 타입
- `time_logs` 데이터 타입
- `weekly_reviews` 데이터 타입
- `goals` 데이터 타입
- `reflections` 데이터 타입
- Supabase `AppDatabase` 타입
- 도메인 타입 re-export 구조
- Supabase 클라이언트의 DB 타입 제네릭 적용
- 기능별 query layer 파일
- `user_id` 기반 query 함수 구조
- Supabase migration SQL
- RLS select/insert/update/delete ownership policy
- `updated_at` 자동 갱신 트리거
- 데이터 모델 문서

## 구현하지 않은 것

- 노트 화면 CRUD
- 업무 화면 CRUD
- 미팅 화면 CRUD
- 루틴 화면 CRUD
- 회고 화면 CRUD
- 복잡한 홈 대시보드 계산
- 차트
- AI 기능
- 캘린더 연동
- UI 대규모 수정
- Milestone 1 인증 구조 변경
- Supabase migration 실행

## 생성한 파일

- `src/types/database.ts`
- `src/types/domain.ts`
- `src/types/index.ts`
- `src/lib/queries/client.ts`
- `src/lib/queries/profiles.ts`
- `src/lib/queries/notes.ts`
- `src/lib/queries/tasks.ts`
- `src/lib/queries/meetings.ts`
- `src/lib/queries/timeLogs.ts`
- `src/lib/queries/weeklyReviews.ts`
- `src/lib/queries/goals.ts`
- `src/lib/queries/reflections.ts`
- `src/lib/queries/index.ts`
- `supabase/migrations/202605050426_milestone_2_data_model.sql`
- `docs/DATA_MODEL.md`

## 수정한 파일

- `src/lib/supabase/browser.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/middleware.ts`

## 실행한 검증

- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run build`
- migration 내 RLS 정책 검색
- query layer 내 `user_id` 조건 검색
- 컴포넌트 내 직접 Supabase table query 검색

## 검증 결과

- 타입 체크: 통과
- 린트: 통과
- 빌드: 통과
- RLS 정책: 8개 테이블에 공통 ownership policy 준비 확인
- `user_id` 접근: query layer에서 `user_id` 조건과 insert ownership 적용 확인
- 컴포넌트 직접 table query: 없음

## 범위 초과 여부

범위 초과 없음. 화면 CRUD, 대시보드 계산, 차트, AI, 캘린더 연동은 구현하지 않았다.

## 현재 한계

- migration 파일은 준비만 되었고 Supabase에 적용하지 않았다.
- query layer는 준비되었지만 UI에서 아직 사용하지 않는다.
- Supabase generated type 자동화는 아직 구성하지 않았다.

## 다음 추천 작업

Supabase 프로젝트에 migration을 적용하고, Milestone 3에서 홈 대시보드 1차 범위를 진행한다.
