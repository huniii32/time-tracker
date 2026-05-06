# Milestone 6-2 Weekly Feedback CRUD

## 작업명

Milestone 6-2 위클리 피드백 CRUD 구현

## 작업 목표

로그인한 사용자가 본인 `weekly_reviews` 데이터를 생성, 조회, 상세 확인, 수정, 삭제할 수 있게 한다.

## 구현한 것

- `/routines` 루틴 화면의 위클리 피드백 탭 연결
- `/routines/weekly-reviews` 위클리 피드백 목록
- 위클리 피드백 작성 화면
- 위클리 피드백 상세 화면
- 위클리 피드백 수정 화면
- 위클리 피드백 삭제 동작
- 목표 달성률 표시
- 낭비 시간 표시
- 루틴 만족도 표시
- `src/lib/queries/weeklyReviews.ts` 기반 사용자별 `weekly_reviews` 접근
- 목표 통합 placeholder 라우트

## 구현하지 않은 것

- 데일리 시간 기록 CRUD 추가 수정
- 목표 통합 CRUD
- 노트 CRUD 추가 수정
- 업무 CRUD 추가 수정
- 미팅 CRUD 추가 수정
- 회고 CRUD
- 홈 대시보드 고도화
- 차트
- AI 기능
- 캘린더 연동
- DB schema 변경
- RLS policy 변경
- 인증 구조 변경
- 대규모 UI 리디자인
- 불필요한 라이브러리 추가

## 생성한 파일

- `src/lib/routines/weeklyReviews.ts`
- `src/components/routines/WeeklyReviewForm.tsx`
- `src/components/routines/WeeklyReviewsList.tsx`
- `src/components/routines/WeeklyReviewDetail.tsx`
- `src/components/routines/EditWeeklyReviewLoader.tsx`
- `src/app/routines/weekly-reviews/page.tsx`
- `src/app/routines/weekly-reviews/new/page.tsx`
- `src/app/routines/weekly-reviews/[id]/page.tsx`
- `src/app/routines/weekly-reviews/[id]/edit/page.tsx`
- `src/app/routines/goals/page.tsx`
- `logs/2026-05-05-0542-milestone-6-2-weekly-feedback-crud.md`

## 수정한 파일

- `src/components/routines/RoutineTabs.tsx`

## 실행한 검증

- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run build`
- `rg "\.from\(" src/app src/components`
- `rg "createGoal|updateGoal|deleteGoal|createReflection|updateReflection|deleteReflection|createTask|updateTask|deleteTask|createMeeting|updateMeeting|deleteMeeting|createNote|updateNote|deleteNote" src/app/routines src/components/routines`
- `rg "listWeeklyReviews|getWeeklyReview|createWeeklyReview|updateWeeklyReview|deleteWeeklyReview" src/app/routines src/components/routines src/lib/routines src/lib/queries/weeklyReviews.ts`
- `rg -F 'from("goals")' src/app/routines src/components/routines src/lib/routines`
- `rg "createGoal|updateGoal|deleteGoal|listGoals|getGoal" src/app/routines src/components/routines src/lib/routines`

## 검증 결과

- 타입 체크: 통과
- 린트: 통과
- 빌드: 통과
- `src/app`, `src/components` 내 직접 `.from(...)` 호출: 없음
- 루틴 범위 밖 CRUD 구현 호출: 없음
- `weekly_reviews` query layer 사용: 확인
- 로그인 사용자 기준 접근: `listWeeklyReviews`, `getWeeklyReview`, `createWeeklyReview`, `updateWeeklyReview`, `deleteWeeklyReview`에 `user.id` 전달 확인
- `/routines`에서 위클리 피드백 탭 링크 확인
- 목표 통합 CRUD 구현 없음

참고: 최초 빌드는 샌드박스 `spawn EPERM` 제한으로 실패했고, 승인된 환경에서 같은 명령을 재실행해 통과했다.

## 범위 초과 여부

범위 초과 없음. 위클리 피드백 CRUD 외 루틴 하위 기능은 목표 통합 placeholder만 추가했다.

## 현재 한계

- 실제 브라우저 로그인 후 위클리 피드백 생성, 상세, 수정, 삭제 흐름은 수동으로 검증하지 않았다.
- 현재 작업 디렉터리는 Git 저장소가 아니라 `git diff/status`를 사용할 수 없다.

## 다음 추천 작업

브라우저에서 로그인 후 위클리 피드백 생성, 목록 반영, 상세 확인, 수정, 삭제를 수동 검증한 뒤 목표 통합 CRUD로 진행한다.
