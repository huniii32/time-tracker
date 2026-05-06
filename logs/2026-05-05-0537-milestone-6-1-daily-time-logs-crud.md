# Milestone 6-1 Daily Time Logs CRUD

## 작업명

Milestone 6-1 데일리 시간 기록 CRUD 구현

## 작업 목표

로그인한 사용자가 본인 `time_logs` 데이터를 생성, 조회, 상세 확인, 수정, 삭제할 수 있게 한다.

## 구현한 것

- `/routines` 루틴 메인 화면
- 루틴 내부 탭 구조
- 데일리 시간 기록 탭 활성화
- 데일리 시간 기록 목록
- 데일리 시간 기록 작성 화면
- 데일리 시간 기록 상세 화면
- 데일리 시간 기록 수정 화면
- 데일리 시간 기록 삭제 동작
- 활동 카테고리 표시
- 집중도 표시
- 만족도 표시
- 시작/종료 기반 기록 시간 표시
- `src/lib/queries/timeLogs.ts` 기반 사용자별 `time_logs` 접근
- 상세 조회를 위한 `getTimeLog` query layer 함수

## 구현하지 않은 것

- 위클리 피드백 CRUD
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

- `src/lib/routines/timeLogs.ts`
- `src/components/routines/RoutineTabs.tsx`
- `src/components/routines/TimeLogBadges.tsx`
- `src/components/routines/TimeLogForm.tsx`
- `src/components/routines/TimeLogsList.tsx`
- `src/components/routines/TimeLogDetail.tsx`
- `src/components/routines/EditTimeLogLoader.tsx`
- `src/app/routines/time-logs/new/page.tsx`
- `src/app/routines/time-logs/[id]/page.tsx`
- `src/app/routines/time-logs/[id]/edit/page.tsx`
- `logs/2026-05-05-0537-milestone-6-1-daily-time-logs-crud.md`

## 수정한 파일

- `src/app/routines/page.tsx`
- `src/lib/queries/timeLogs.ts`

## 실행한 검증

- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run build`
- `rg "\.from\(" src/app src/components`
- `rg "createWeeklyReview|updateWeeklyReview|deleteWeeklyReview|createGoal|updateGoal|deleteGoal|createReflection|updateReflection|deleteReflection|createTask|updateTask|deleteTask|createMeeting|updateMeeting|deleteMeeting|createNote|updateNote|deleteNote" src/app/routines src/components/routines`
- `rg "listTimeLogs|getTimeLog|createTimeLog|updateTimeLog|deleteTimeLog" src/app/routines src/components/routines src/lib/routines src/lib/queries/timeLogs.ts`
- `rg "weekly_reviews|goals|WeeklyReview|Goal" src/app/routines src/components/routines src/lib/routines`

## 검증 결과

- 타입 체크: 통과
- 린트: 통과
- 빌드: 통과
- `src/app`, `src/components` 내 직접 `.from(...)` 호출: 없음
- 루틴 범위 밖 CRUD 구현 호출: 없음
- `time_logs` query layer 사용: 확인
- 로그인 사용자 기준 접근: `listTimeLogs`, `getTimeLog`, `createTimeLog`, `updateTimeLog`, `deleteTimeLog`에 `user.id` 전달 확인
- `/routines`에서 데일리 시간 기록 탭과 목록 접근 확인
- 위클리 피드백, 목표 통합 CRUD 구현 없음

참고: 최초 빌드는 샌드박스 `spawn EPERM` 제한으로 실패했고, 승인된 환경에서 같은 명령을 재실행해 통과했다.

## 범위 초과 여부

범위 초과 없음. 데일리 시간 기록 CRUD 외 루틴 하위 기능은 placeholder만 추가했다.

## 현재 한계

- 실제 브라우저 로그인 후 시간 기록 생성, 상세, 수정, 삭제 흐름은 수동으로 검증하지 않았다.
- 현재 작업 디렉터리는 Git 저장소가 아니라 `git diff/status`를 사용할 수 없다.

## 다음 추천 작업

브라우저에서 로그인 후 데일리 시간 기록 생성, 목록 반영, 상세 확인, 수정, 삭제를 수동 검증한 뒤 위클리 피드백 CRUD로 진행한다.
