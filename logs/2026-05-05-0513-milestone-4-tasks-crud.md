# Milestone 4 Tasks CRUD

## 작업명

Milestone 4 업무 보드 CRUD 구현

## 작업 목표

로그인한 사용자가 본인 `tasks` 데이터를 생성, 조회, 상세 확인, 수정, 삭제하고 상태를 관리할 수 있게 한다.

## 구현한 것

- 업무 보드 메인 화면
- 업무 목록 조회
- 업무 작성 화면
- 업무 상세 화면
- 업무 수정 화면
- 업무 삭제 동작
- 목록 내 업무 상태 변경
- 상태별 필터
- 우선순위 표시
- 마감기한 표시
- 마감 임박 및 마감 지남 표시
- 태그 입력 및 표시
- 만족도 입력 및 표시
- `src/lib/queries/tasks.ts` 기반 사용자별 `tasks` 접근

## 구현하지 않은 것

- 미팅 CRUD
- 노트 CRUD 추가 수정
- 루틴 CRUD
- 회고 CRUD
- 차트
- AI 기능
- 캘린더 연동
- 홈 대시보드 고도화
- DB schema 변경
- RLS policy 변경
- 인증 구조 변경
- 대규모 UI 리디자인
- 불필요한 라이브러리 추가

## 생성한 파일

- `src/lib/tasks/config.ts`
- `src/lib/tasks/form.ts`
- `src/components/tasks/TaskBadges.tsx`
- `src/components/tasks/TaskForm.tsx`
- `src/components/tasks/TasksList.tsx`
- `src/components/tasks/TaskDetail.tsx`
- `src/components/tasks/EditTaskLoader.tsx`
- `src/app/tasks/new/page.tsx`
- `src/app/tasks/[id]/page.tsx`
- `src/app/tasks/[id]/edit/page.tsx`
- `logs/2026-05-05-0513-milestone-4-tasks-crud.md`

## 수정한 파일

- `src/app/tasks/page.tsx`

## 실행한 검증

- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run build`
- `rg "\.from\(" src/app src/components`
- `rg "createMeeting|updateMeeting|deleteMeeting|createTimeLog|createWeeklyReview|createGoal|createReflection|updateReflection|deleteReflection" src/app src/components`
- `rg "listTasks|createTask|updateTask|deleteTask|getTask" src/app/tasks src/components/tasks src/lib/tasks`

## 검증 결과

- 타입 체크: 통과
- 린트: 통과
- 빌드: 통과
- `src/app`, `src/components` 내 직접 `.from(...)` 호출: 없음
- 업무 범위 밖 CRUD 구현 호출: 없음
- tasks query layer 사용: 확인
- 로그인 사용자 기준 접근: `listTasks`, `getTask`, `createTask`, `updateTask`, `deleteTask`에 `user.id` 전달 확인

참고: 최초 빌드는 샌드박스 `spawn EPERM` 제한으로 실패했고, 승인된 환경에서 같은 명령을 재실행해 통과했다.

## 범위 초과 여부

범위 초과 없음. 업무 CRUD 외 기능, DB schema, RLS, 인증 구조는 변경하지 않았다.

## 현재 한계

- 실제 브라우저 로그인 후 업무 생성, 상세, 수정, 삭제, 상태 변경 흐름은 수동으로 검증하지 않았다.
- 현재 작업 디렉터리는 Git 저장소가 아니라 `git diff/status`를 사용할 수 없었다.

## 다음 추천 작업

브라우저에서 로그인 후 업무 생성, 상태 변경, 상세 확인, 수정, 삭제를 수동 검증한 뒤 다음 마일스톤인 미팅 보드 CRUD로 진행한다.
