# Work Tabs Navigation Fix

## 작업명

업무 화면에 미팅 보드 탭 연결

## 작업 목표

`/tasks`와 `/meetings`를 업무 영역 안에서 전환할 수 있게 하고, 두 경로 모두 하단 네비게이션의 업무 탭이 active 상태로 표시되게 한다.

## 구현한 것

- 공통 `WorkTabs` 컴포넌트 생성
- `/tasks` 상단에 업무 보드 / 미팅 보드 전환 탭 추가
- `/meetings` 상단에 업무 보드 / 미팅 보드 전환 탭 추가
- 업무 보드 탭 클릭 시 `/tasks` 이동
- 미팅 보드 탭 클릭 시 `/meetings` 이동
- 현재 경로 기준 active 탭 스타일 적용
- `/meetings` 경로에서도 하단 네비게이션의 업무 탭이 active 되도록 판정 수정

## 구현하지 않은 것

- 업무 CRUD 로직 변경
- 미팅 CRUD 로직 변경
- 노트 CRUD 수정
- 루틴 CRUD 구현
- 회고 CRUD 구현
- DB schema 변경
- RLS policy 변경
- 인증 구조 변경
- 대규모 UI 리디자인
- 불필요한 라이브러리 추가

## 생성한 파일

- `src/components/layout/WorkTabs.tsx`
- `logs/2026-05-05-0527-work-tabs-navigation-fix.md`

## 수정한 파일

- `src/components/layout/BottomNav.tsx`
- `src/app/tasks/page.tsx`
- `src/app/meetings/page.tsx`

## 실행한 검증

- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run build`
- `rg "\.from\(" src/app src/components`
- `rg "createTask|updateTask|deleteTask|createMeeting|updateMeeting|deleteMeeting|createNote|updateNote|deleteNote" src/app/tasks src/app/meetings src/components/layout/WorkTabs.tsx src/components/layout/BottomNav.tsx`
- `rg "WorkTabs|/meetings|/tasks" src/app/tasks src/app/meetings src/components/layout`

## 검증 결과

- 타입 체크: 통과
- 린트: 통과
- 빌드: 통과
- `/tasks`에서 `WorkTabs` 렌더링 확인
- `/meetings`에서 `WorkTabs` 렌더링 확인
- `WorkTabs`의 `/tasks`, `/meetings` 링크 확인
- `/meetings` 경로에서 하단 네비게이션 업무 탭 active 판정 확인
- 직접 `.from(...)` 호출 추가 없음
- 업무/미팅 CRUD 로직 변경 없음

참고: 최초 빌드는 샌드박스 `spawn EPERM` 제한으로 실패했고, 승인된 환경에서 같은 명령을 재실행해 통과했다.

## 범위 초과 여부

범위 초과 없음. 업무/미팅 연결 UX와 하단 네비게이션 active 판정만 수정했다.

## 현재 한계

- 실제 브라우저 클릭으로 `/tasks`와 `/meetings` 전환은 수동 검증하지 않았다.
- 현재 작업 디렉터리는 Git 저장소가 아니라 `git diff/status`를 사용할 수 없다.

## 다음 추천 작업

브라우저에서 하단 업무 탭, 업무 보드 탭, 미팅 보드 탭 active 상태와 이동 흐름을 수동 검증한다.
