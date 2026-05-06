# 작업명

모바일 UX 개선

# 작업 목표

iPhone Safari 기준으로 앱을 실제로 사용할 때 화면이 답답하거나 불편하지 않도록 기능 로직 변경 없이 모바일 레이아웃, 터치 영역, safe area, 긴 폼 사용성을 개선한다.

# 구현한 것

- 전역 CSS에서 iOS 텍스트 크기 보정, 터치 포커스, 입력/버튼 최소 터치 높이 정리
- iPhone Safari 하단 safe area를 고려한 하단 탭 여백 적용
- `AppShell`의 본문 하단 padding을 하단 탭 높이와 safe area 기준으로 확대
- Header 높이와 safe area, 브랜드 텍스트 truncation 정리
- 하단 탭 네비게이션 고정 상태, 터치 영역, 활성 상태 가독성 개선
- WorkTabs와 RoutineTabs 터치 영역 및 모바일 라벨 정리
- 공통 Card padding/line-height 개선
- 로그인/회원가입 화면의 모바일 여백, 입력 간격, 버튼 터치 영역 개선
- 주요 작성/수정 폼의 섹션 간격 확대
- 주요 작성/수정 폼의 취소/저장 영역을 하단 탭 위 sticky action bar로 개선
- 긴 입력 폼에서 입력 요소가 하단 탭에 가려지지 않도록 scroll margin 적용

# 구현하지 않은 것

- CRUD 로직 변경
- Supabase query 변경
- DB schema 변경
- RLS policy 변경
- 인증 구조 변경
- 새로운 기능 추가
- 차트 추가
- AI 기능 추가
- 캘린더 연동
- 불필요한 라이브러리 추가
- 대규모 디자인 리브랜딩

# 생성한 파일

- `logs/2026-05-06-2106-mobile-ux-improvement.md`

# 수정한 파일

- `src/app/globals.css`
- `src/app/login/page.tsx`
- `src/app/signup/page.tsx`
- `src/components/common/Card.tsx`
- `src/components/layout/AppShell.tsx`
- `src/components/layout/BottomNav.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/SignOutButton.tsx`
- `src/components/layout/WorkTabs.tsx`
- `src/components/routines/RoutineTabs.tsx`
- `src/components/tasks/TaskForm.tsx`
- `src/components/notes/NoteForm.tsx`
- `src/components/meetings/MeetingForm.tsx`
- `src/components/routines/TimeLogForm.tsx`
- `src/components/routines/WeeklyReviewForm.tsx`
- `src/components/routines/GoalForm.tsx`
- `src/components/reflections/ReflectionForm.tsx`

# 실행한 검증

- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run build`
- `rg "\\.from\\(" src\\app src\\components`
- `rg "createNote|updateNote|deleteNote|createTask|updateTask|deleteTask|createMeeting|updateMeeting|deleteMeeting|createTimeLog|updateTimeLog|deleteTimeLog|createWeeklyReview|updateWeeklyReview|deleteWeeklyReview|createGoal|updateGoal|deleteGoal|createReflection|updateReflection|deleteReflection|signInWithPassword|signUp|signOut" src\\app src\\components`
- `rg "env\\(safe-area-inset-bottom\\)|form-actions|min-h-12|min-h-\\[68px\\]|pb-\\[calc\\(7rem" src\\app src\\components`

# 검증 결과

- 타입 체크 통과
- 린트 통과
- 빌드 통과
- 첫 빌드는 PowerShell 샌드박스에서 `spawn EPERM`으로 실패했고, 승인된 외부 실행에서 통과
- `src/app`, `src/components` 내 직접 `.from(...)` 호출 없음
- 새 Supabase query 호출 추가 없음
- 기존 CRUD 라우트는 빌드 결과에 포함됨
- 하단 탭 safe area 관련 클래스 적용 확인
- 주요 작성/수정 폼의 sticky `form-actions` 적용 확인

# 범위 초과 여부

범위 초과 구현 없음.

# 현재 한계

- 실제 iPhone Safari 기기에서 수동 터치/스크롤 검증은 수행하지 않았다.
- Playwright 모바일 스크린샷 검증은 수행하지 않았다.
- 기존 기능 로직은 유지했으며, UI 클래스와 일부 사용자 표시 문구만 정리했다.

# 다음 추천 작업

실제 iPhone Safari 또는 모바일 에뮬레이터에서 로그인, 홈, 목록, 상세, 긴 작성/수정 폼을 순서대로 수동 점검한다.
