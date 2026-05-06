# 작업명

Time Tracker 스타일 UI 리디자인

# 작업 목표

기능 로직을 변경하지 않고 앱 표시명과 전체 UI 톤을 `Time Tracker` 중심으로 정리하고, 첨부 레퍼런스처럼 화이트/라이트그레이 기반의 깔끔한 SaaS 대시보드 스타일로 개선한다.

# 구현한 것

- 앱 표시명을 `Time Tracker`로 변경
- 메타데이터 title/description을 `Time Tracker` 기준으로 정리
- 로그인 화면 브랜드 영역, 소개 패널, 폼 UI 개선
- 회원가입 화면 브랜드 영역과 폼 UI 개선
- Header 로고/앱 이름을 `Time Tracker`로 정리
- 데스크톱용 상단 네비게이션 추가
- 모바일 하단 탭 active 상태를 네이비 기반으로 강화
- AppShell을 넓은 대시보드형 최대 너비와 브랜드 헤더 카드 스타일로 개선
- 공통 Card의 radius, border, shadow, padding 통일
- WorkTabs, RoutineTabs를 SaaS 세그먼트 탭 스타일로 개선
- 홈 대시보드를 네이비 히어로, 요약 카드, 2열/3열 반응형 카드 그리드로 개선
- 홈 대시보드에 입사 D+일차, 오늘 기록 시간, 진행 중 업무, 목표 진행률, 최근 노트, 업무 요약, 이번 주 시간 요약, 최근 회고, 최근 감정 상태, 최근 미팅을 카드형으로 정리
- 전역 입력 필드, select, textarea 스타일을 통일
- 기존 CTA 버튼 일부를 네이비/그림자 기반으로 정리
- 모바일 safe area와 sticky form action bar 유지

# 구현하지 않은 것

- CRUD 로직 변경
- Supabase query layer 변경
- DB schema 변경
- RLS policy 변경
- 인증 구조 변경
- 새로운 기능 추가
- 차트 라이브러리 추가
- AI 기능 추가
- 캘린더 연동
- 라우트 구조 대규모 변경
- 불필요한 라이브러리 추가
- 파일명/테이블명 변경

# 생성한 파일

- `logs/2026-05-06-2137-time-tracker-ui-redesign.md`

# 수정한 파일

- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/app/page.tsx`
- `src/app/login/page.tsx`
- `src/app/signup/page.tsx`
- `src/app/notes/page.tsx`
- `src/app/tasks/page.tsx`
- `src/app/meetings/page.tsx`
- `src/app/routines/page.tsx`
- `src/app/routines/weekly-reviews/page.tsx`
- `src/app/routines/goals/page.tsx`
- `src/app/reflections/page.tsx`
- `src/components/common/Card.tsx`
- `src/components/layout/AppShell.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/SignOutButton.tsx`
- `src/components/layout/BottomNav.tsx`
- `src/components/layout/WorkTabs.tsx`
- `src/components/routines/RoutineTabs.tsx`
- `src/components/home/HomeDashboard.tsx`

# 실행한 검증

- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run build`
- `rg "Onboarding Tracker|회사 적응기|회사 적응 기록" src\\app src\\components`
- `rg "\\.from\\(" src\\app src\\components`
- `rg "createNote|updateNote|deleteNote|createTask|updateTask|deleteTask|createMeeting|updateMeeting|deleteMeeting|createTimeLog|updateTimeLog|deleteTimeLog|createWeeklyReview|updateWeeklyReview|deleteWeeklyReview|createGoal|updateGoal|deleteGoal|createReflection|updateReflection|deleteReflection|signInWithPassword|signUp|signOut" src\\app src\\components`
- `Get-Content -LiteralPath package.json`

# 검증 결과

- 타입 체크 통과
- 린트 통과
- 빌드 통과
- 첫 빌드는 PowerShell 샌드박스에서 `spawn EPERM`으로 실패했고, 승인된 외부 실행에서 통과
- 빌드 결과에서 주요 라우트 렌더링 대상 포함 확인
- 기존 앱 표시명 검색 결과 없음
- `src/app`, `src/components` 내 직접 `.from(...)` 호출 없음
- 기존 CRUD/query 호출은 기존 query layer 기반으로 유지됨
- `package.json` 의존성 변경 없음

# 범위 초과 여부

범위 초과 구현 없음.

# 현재 한계

- 실제 브라우저, iPhone Safari, 데스크톱 화면에서 시각적 수동 검증은 수행하지 않았다.
- 전체 화면을 픽셀 단위로 완전 재설계하지는 않았고, 공통 레이아웃/카드/탭/인증/홈 중심으로 제품 톤을 정리했다.
- 기존 CRUD 화면 내부의 세부 텍스트와 일부 로컬 UI 클래스는 유지하되 전역 스타일과 공통 Card로 통일감을 보강했다.

# 다음 추천 작업

로컬 개발 서버에서 로그인, 홈, 노트/업무/미팅/루틴/회고의 목록/상세/작성 화면을 모바일과 데스크톱 폭으로 수동 점검한다.
