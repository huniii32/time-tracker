# 작업명

Milestone 6-3 목표 통합 CRUD 구현

# 작업 목표

로그인한 사용자가 `/routines`의 목표 통합 탭에서 3개월 목표를 분기, 월간, 주간, 일간 목표로 나눠 생성, 조회, 상세 확인, 수정, 삭제할 수 있게 한다.

# 구현한 것

- `/routines/goals` 목표 통합 탭의 실제 목록 화면 연결
- 목표 목록 화면
- 목표 작성 화면
- 목표 상세 화면
- 목표 수정 화면
- 목표 삭제 동작
- 목표 유형, 목표 레벨, 우선순위, 진행률 표시
- 성공 기준과 회고 표시
- 현재 로그인한 사용자 `user.id` 기준 `goals` query layer 호출
- 컴포넌트에서 직접 Supabase table query를 호출하지 않고 `src/lib/queries/goals.ts` 사용
- 목표 입력 항목: 목표명, 목표 유형, 목표 레벨, 기간, 우선순위, 성공 기준, 진행률, 회고
- 목표 유형 UI: 회사 적응, 업무 성과, 직무 관련, 자격증, 건강 관리, 생활 관리, 기타

# 구현하지 않은 것

- 데일리 시간 기록 CRUD 추가 수정
- 위클리 피드백 CRUD 추가 수정
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

# 생성한 파일

- `src/lib/routines/goals.ts`
- `src/components/routines/GoalsList.tsx`
- `src/components/routines/GoalForm.tsx`
- `src/components/routines/GoalDetail.tsx`
- `src/components/routines/EditGoalLoader.tsx`
- `src/app/routines/goals/new/page.tsx`
- `src/app/routines/goals/[id]/page.tsx`
- `src/app/routines/goals/[id]/edit/page.tsx`
- `logs/2026-05-06-2028-milestone-6-3-goals-crud.md`

# 수정한 파일

- `src/app/routines/goals/page.tsx`
- `src/components/routines/RoutineTabs.tsx`

# 실행한 검증

- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run build`
- `rg "\\.from\\(" src\\app src\\components`
- `rg "createGoal|listGoals|getGoal|updateGoal|deleteGoal" src\\app src\\components src\\lib`
- `rg "user\\.id" src\\components\\routines src\\app\\routines`
- `rg "회사 적응|업무 성과|직무 관련|자격증|건강 관리|생활 관리|기타|목표 통합" src\\app src\\components src\\lib`

# 검증 결과

- 타입 체크 통과
- 린트 통과
- 빌드 통과
- 첫 빌드는 PowerShell 샌드박스에서 `spawn EPERM`으로 실패했고, 승인된 외부 실행에서 통과
- `src/app`, `src/components` 내 직접 `.from(...)` 호출 없음
- 목표 CRUD 컴포넌트는 `src/lib/queries/goals.ts`의 `listGoals`, `getGoal`, `createGoal`, `updateGoal`, `deleteGoal` 사용
- 목표 조회, 상세, 생성, 수정, 삭제 흐름에서 현재 로그인 사용자 `user.id` 전달 확인
- `/routines/goals`, `/routines/goals/new`, `/routines/goals/[id]`, `/routines/goals/[id]/edit` 라우트 생성 확인
- 목표 유형 UI에 회사 적응, 업무 성과, 직무 관련, 자격증, 건강 관리, 생활 관리, 기타 반영 확인

# 범위 초과 여부

범위 초과 구현 없음.

# 현재 한계

- DB schema 변경 금지 조건 때문에 기존 `goals.goal_type` 허용값 안에서 목표 유형 UI를 구성했다.
- 기존 schema에는 별도 `life_management` 값이 없어 생활 관리 UI는 기존 허용값 중 하나에 매핑되어 있다.
- 브라우저에서 실제 Supabase 세션으로 수동 CRUD 조작까지는 수행하지 않았다.

# 다음 추천 작업

Milestone 6 범위 검증을 한 번 더 수행한 뒤, 다음 마일스톤인 회고 기능으로 진행한다.
