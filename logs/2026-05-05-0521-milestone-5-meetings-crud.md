# Milestone 5 Meetings CRUD

## 작업명

Milestone 5 미팅 보드 CRUD 구현

## 작업 목표

로그인한 사용자가 본인 `meetings` 데이터를 생성, 조회, 상세 확인, 수정, 삭제하고 결정사항과 액션아이템의 반영 여부를 관리할 수 있게 한다.

## 구현한 것

- 미팅 보드 메인 화면
- 미팅 목록 조회
- 미팅 작성 화면
- 미팅 상세 화면
- 미팅 수정 화면
- 미팅 삭제 동작
- 목록 및 상세 화면의 반영 여부 체크
- 미반영 회의 필터
- 참석자 입력 및 표시
- 결정사항 입력 및 표시
- 액션아이템 입력 및 표시
- 마감기한 표시
- 태그 입력 및 표시
- `src/lib/queries/meetings.ts` 기반 사용자별 `meetings` 접근

## 구현하지 않은 것

- 업무 CRUD 추가 수정
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

- `src/lib/meetings/form.ts`
- `src/components/meetings/MeetingBadges.tsx`
- `src/components/meetings/MeetingForm.tsx`
- `src/components/meetings/MeetingsList.tsx`
- `src/components/meetings/MeetingDetail.tsx`
- `src/components/meetings/EditMeetingLoader.tsx`
- `src/app/meetings/page.tsx`
- `src/app/meetings/new/page.tsx`
- `src/app/meetings/[id]/page.tsx`
- `src/app/meetings/[id]/edit/page.tsx`
- `logs/2026-05-05-0521-milestone-5-meetings-crud.md`

## 수정한 파일

없음.

## 실행한 검증

- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run build`
- `rg "\.from\(" src/app src/components`
- `rg "createTask|updateTask|deleteTask|createNote|updateNote|deleteNote|createTimeLog|createWeeklyReview|createGoal|createReflection|updateReflection|deleteReflection" src/app/meetings src/components/meetings`
- `rg "listMeetings|getMeeting|createMeeting|updateMeeting|deleteMeeting" src/app/meetings src/components/meetings src/lib/meetings`

## 검증 결과

- 타입 체크: 통과
- 린트: 통과
- 빌드: 통과
- `src/app`, `src/components` 내 직접 `.from(...)` 호출: 없음
- 미팅 범위 밖 CRUD 구현 호출: 없음
- meetings query layer 사용: 확인
- 로그인 사용자 기준 접근: `listMeetings`, `getMeeting`, `createMeeting`, `updateMeeting`, `deleteMeeting`에 `user.id` 전달 확인

참고: 최초 빌드는 샌드박스 `spawn EPERM` 제한으로 실패했고, 승인된 환경에서 같은 명령을 재실행해 통과했다.

## 범위 초과 여부

범위 초과 없음. 미팅 CRUD 외 기능, DB schema, RLS, 인증 구조는 변경하지 않았다.

## 현재 한계

- 실제 브라우저 로그인 후 미팅 생성, 상세, 수정, 삭제, 반영 여부 변경 흐름은 수동으로 검증하지 않았다.
- 현재 작업 디렉터리는 Git 저장소가 아니라 `git status`를 사용할 수 없었다.

## 다음 추천 작업

브라우저에서 로그인 후 미팅 생성, 반영 여부 변경, 미반영 필터, 상세 확인, 수정, 삭제를 수동 검증한 뒤 다음 마일스톤인 루틴 기능으로 진행한다.
