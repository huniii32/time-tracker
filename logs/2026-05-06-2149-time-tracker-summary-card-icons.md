# 작업명

Time Tracker 홈 요약 카드 아이콘 보강

# 작업 목표

기능 로직을 변경하지 않고 홈 대시보드 상단 요약 카드의 빈 원형 영역과 Header 브랜드 로고에 `Time Tracker` 톤에 맞는 아이콘을 추가한다.

# 읽은 문서

- `AGENTS.md`
- `docs/MILESTONES.md`
- `docs/HARNESS.md`
- `agents/ui-agent.md`

# 구현한 것

- 홈 대시보드 상단 요약 카드 4개에 의미 기반 아이콘 추가
- 입사 D+일차 카드에 `CalendarDays` 아이콘 추가
- 오늘 기록 시간 카드에 `Clock3` 아이콘 추가
- 진행 중 업무 카드에 `CheckSquare` 아이콘 추가
- 목표 진행률 카드에 `Target` 아이콘 추가
- 카드별 연한 배경색과 한 단계 진한 아이콘 색상 적용
- 아이콘을 기존 원형/라운드 영역 안에 `h-5 w-5` 크기로 배치
- Header의 `Time Tracker` 브랜드 로고를 `Clock3` 아이콘 기반 로고로 변경
- 장식용 아이콘에 `aria-hidden="true"` 적용
- `lucide-react`가 설치되어 있지 않아 새 패키지 추가 없이 inline SVG 컴포넌트로 구현

# 구현하지 않은 것

- CRUD 로직 변경
- Supabase query layer 변경
- DB schema 변경
- RLS policy 변경
- 인증 구조 변경
- 라우트 구조 변경
- 새로운 기능 추가
- 차트 추가
- AI 기능 추가
- 캘린더 연동
- 별도 SVG 파일 추가
- 불필요한 패키지 설치
- 전체 UI 리디자인
- 파일명/테이블명 변경

# 생성한 파일

- `logs/2026-05-06-2149-time-tracker-summary-card-icons.md`

# 수정한 파일

- `src/components/home/HomeDashboard.tsx`
- `src/components/layout/Header.tsx`

# 실행한 검증

- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run build`
- `rg "\.from\(" src\app src\components`
- `rg "createNote|updateNote|deleteNote|createTask|updateTask|deleteTask|createMeeting|updateMeeting|deleteMeeting|createTimeLog|updateTimeLog|deleteTimeLog|createWeeklyReview|updateWeeklyReview|deleteWeeklyReview|createGoal|updateGoal|deleteGoal|createReflection|updateReflection|deleteReflection|signInWithPassword|signUp|signOut" src\app src\components`
- `rg "lucide-react" package.json`
- `rg -n "icon=\{|iconBgClass|Clock3|CalendarDays|CheckSquare|Target" src\components\home\HomeDashboard.tsx src\components\layout\Header.tsx`

# 검증 결과

- 타입 체크 통과
- 린트 통과
- 빌드 통과
- 첫 빌드는 PowerShell 샌드박스에서 `spawn EPERM`으로 실패했고, 승인된 외부 실행에서 통과
- `src/app`, `src/components` 내 직접 `.from(...)` 호출 없음
- CRUD 및 인증 호출은 기존 컴포넌트의 기존 query/auth 흐름만 검색됨
- `lucide-react`는 `package.json`에 없어 새 의존성을 추가하지 않음
- 홈 요약 카드와 Header에 지정 아이콘 렌더링 코드 확인

# 범위 초과 여부

범위 초과 구현 없음.

# 현재 한계

- 실제 브라우저에서 모바일/데스크톱 시각 검증은 수행하지 않았다.
- 아이콘 라이브러리가 없어 `lucide-react` 패키지 설치 대신 동일한 선형 스타일의 inline SVG 컴포넌트를 사용했다.

# 남은 이슈 또는 다음 추천 작업

로컬 개발 서버에서 홈 대시보드와 Header를 모바일/데스크톱 폭으로 직접 확인한다.
