# 작업명

Milestone 8 홈 대시보드 고도화

# 작업 목표

로그인한 사용자가 앱에 접속했을 때 노트, 업무, 미팅, 루틴, 목표, 회고 데이터를 한눈에 확인할 수 있도록 홈 대시보드를 고도화한다.

# 구현한 것

- 홈 대시보드 실제 데이터 연결
- 입사 D+일차 표시
- 오늘 날짜 표시
- 최근 노트 3개 요약
- 오늘 또는 진행 중 업무 3개 요약
- 마감 임박 업무 요약
- 최근 미팅 3개 요약
- 이번 주 데일리 시간 기록 존재 여부와 시간 요약
- 이번 주 코딩 공부 시간 요약
- 이번 주 논문 리뷰 시간 요약
- 이번 주 업무 시간 요약
- 목표 평균 진행률 요약
- 최근 회고 1개 요약
- 최근 감정노트 기반 감정 상태 요약
- 데이터가 없는 경우 빈 상태 UI
- 각 카드 또는 항목에서 관련 목록/상세 화면으로 이동하는 링크
- 현재 로그인한 사용자 `user.id` 기준 기존 query layer 호출
- 컴포넌트에서 직접 Supabase table query를 호출하지 않고 기존 query layer 사용

# 구현하지 않은 것

- 노트 CRUD 추가 수정
- 업무 CRUD 추가 수정
- 미팅 CRUD 추가 수정
- 루틴 CRUD 추가 수정
- 회고 CRUD 추가 수정
- DB schema 변경
- RLS policy 변경
- 인증 구조 변경
- 차트 라이브러리 추가
- AI 기능
- 캘린더 연동
- 대규모 UI 리디자인
- 불필요한 라이브러리 추가

# 생성한 파일

- `src/lib/home/dashboard.ts`
- `src/components/home/HomeDashboard.tsx`
- `logs/2026-05-06-2041-milestone-8-home-dashboard-enhancement.md`

# 수정한 파일

- `src/app/page.tsx`

# 실행한 검증

- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run build`
- `rg "\\.from\\(" src\\app src\\components`
- `rg "listNotes|listTasks|listMeetings|listTimeLogs|listGoals|listReflections|getProfile" src\\components\\home src\\app\\page.tsx src\\lib\\home`
- `rg "user\\.id" src\\components\\home src\\app\\page.tsx`
- `rg "createNote|updateNote|deleteNote|createTask|updateTask|deleteTask|createMeeting|updateMeeting|deleteMeeting|createTimeLog|updateTimeLog|deleteTimeLog|createWeeklyReview|updateWeeklyReview|deleteWeeklyReview|createGoal|updateGoal|deleteGoal|createReflection|updateReflection|deleteReflection" src\\components\\home src\\app\\page.tsx src\\lib\\home`
- `rg "아직|없습니다|미설정|--" src\\components\\home src\\app\\page.tsx`

# 검증 결과

- 타입 체크 통과
- 린트 통과
- 빌드 통과
- 첫 빌드는 PowerShell 샌드박스에서 `spawn EPERM`으로 실패했고, 승인된 외부 실행에서 통과
- `src/app`, `src/components` 내 직접 `.from(...)` 호출 없음
- 홈 대시보드는 `getProfile`, `listNotes`, `listTasks`, `listMeetings`, `listTimeLogs`, `listGoals`, `listReflections` query layer 사용
- 홈 데이터 조회 흐름에서 현재 로그인 사용자 `user.id` 전달 확인
- 홈 대시보드 외 CRUD 호출 없음
- 빈 상태 문구 확인
- 빌드 결과에서 기존 CRUD 라우트 포함 확인

# 범위 초과 여부

범위 초과 구현 없음.

# 현재 한계

- 브라우저에서 실제 Supabase 세션으로 수동 대시보드 렌더링까지는 수행하지 않았다.
- 차트 라이브러리 없이 숫자와 링크 중심의 카드 요약으로 구현했다.
- 최근 감정 상태는 기존 감정노트의 `fields.emotion`, `fields.intensity`, `fields.situation` 값이 있을 때만 상세하게 표시된다.

# 다음 추천 작업

실제 계정 데이터로 홈 대시보드 요약 값과 각 링크 이동을 수동 점검한 뒤, 모바일 UX 및 배포 검증 단계로 진행한다.
