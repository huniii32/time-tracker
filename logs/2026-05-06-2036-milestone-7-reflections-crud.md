# 작업명

Milestone 7 회고 CRUD 구현

# 작업 목표

로그인한 사용자가 하루의 배움, 어려움, 잘한 점, 내일 적용할 행동, 커뮤니케이션 인사이트, 기술 인사이트, 감정 관리 포인트를 생성, 조회, 상세 확인, 수정, 삭제할 수 있게 한다.

# 구현한 것

- `/reflections` 회고 메인 화면
- 회고 목록 조회
- 회고 작성 화면
- 회고 상세 화면
- 회고 수정 화면
- 회고 삭제 동작
- 날짜 표시
- 오늘 배운 점 표시
- 어려웠던 점 표시
- 잘한 점 표시
- 내일 적용할 행동 표시
- 커뮤니케이션 인사이트 표시
- 기술 인사이트 표시
- 감정 관리 포인트 표시
- 현재 로그인한 사용자 `user.id` 기준 `reflections` query layer 호출
- 컴포넌트에서 직접 Supabase table query를 호출하지 않고 `src/lib/queries/reflections.ts` 사용
- 회고 입력 항목: 날짜, 오늘 배운 점, 오늘 어려웠던 점, 오늘 잘한 점, 내일 적용할 행동, 커뮤니케이션에서 배운 점, 기술적으로 배운 점, 감정적으로 관리해야 할 점

# 구현하지 않은 것

- 노트 CRUD 추가 수정
- 업무 CRUD 추가 수정
- 미팅 CRUD 추가 수정
- 루틴 CRUD 추가 수정
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

- `src/lib/reflections/form.ts`
- `src/components/reflections/ReflectionsList.tsx`
- `src/components/reflections/ReflectionForm.tsx`
- `src/components/reflections/ReflectionDetail.tsx`
- `src/components/reflections/EditReflectionLoader.tsx`
- `src/app/reflections/new/page.tsx`
- `src/app/reflections/[id]/page.tsx`
- `src/app/reflections/[id]/edit/page.tsx`
- `logs/2026-05-06-2036-milestone-7-reflections-crud.md`

# 수정한 파일

- `src/app/reflections/page.tsx`

# 실행한 검증

- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run build`
- `rg "\\.from\\(" src\\app src\\components`
- `rg "listReflections|getReflection|createReflection|updateReflection|deleteReflection" src\\app src\\components src\\lib`
- `rg "user\\.id" src\\components\\reflections src\\app\\reflections`
- `Get-ChildItem -Recurse -LiteralPath src\\app\\reflections`
- `rg "createNote|updateNote|deleteNote|createTask|updateTask|deleteTask|createMeeting|updateMeeting|deleteMeeting|createTimeLog|updateTimeLog|deleteTimeLog|createWeeklyReview|updateWeeklyReview|deleteWeeklyReview|createGoal|updateGoal|deleteGoal" src\\components\\reflections src\\app\\reflections src\\lib\\reflections`

# 검증 결과

- 타입 체크 통과
- 린트 통과
- 빌드 통과
- 첫 빌드는 PowerShell 샌드박스에서 `spawn EPERM`으로 실패했고, 승인된 외부 실행에서 통과
- `src/app`, `src/components` 내 직접 `.from(...)` 호출 없음
- 회고 CRUD 컴포넌트는 `src/lib/queries/reflections.ts`의 `listReflections`, `getReflection`, `createReflection`, `updateReflection`, `deleteReflection` 사용
- 회고 조회, 상세, 생성, 수정, 삭제 흐름에서 현재 로그인 사용자 `user.id` 전달 확인
- `/reflections`, `/reflections/new`, `/reflections/[id]`, `/reflections/[id]/edit` 라우트 생성 확인
- 회고 범위 밖 CRUD 호출 없음

# 범위 초과 여부

범위 초과 구현 없음.

# 현재 한계

- 브라우저에서 실제 Supabase 세션으로 수동 CRUD 조작까지는 수행하지 않았다.
- 기존 UI 패턴을 따라 모바일 우선 카드/폼 형태로 구현했으며, 대규모 UI 리디자인은 하지 않았다.

# 다음 추천 작업

홈 대시보드 고도화 마일스톤으로 이동하기 전에 기존 마일스톤 CRUD 화면을 실제 계정으로 한 번씩 수동 점검한다.
