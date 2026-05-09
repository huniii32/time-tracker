# 작업 로그: 루틴 데일리 시간 화면 및 시간 기록 작성 폼 재정리

## 작업 목표

루틴 `데일리 시간` 탭에서 월간 캘린더, 이번 주 루틴 현황, 오늘의 시간 기록의 역할을 분리하고, 시간 기록 작성/수정 폼의 유형과 만족도 입력을 정리한다.

## 구현한 것

- 시간 기록 작성/수정 폼의 `업무 유형` 라벨을 `유형`으로 변경했다.
- 유형 선택 옵션을 `운동`, `공부`, `업무`, `여가 활동`, `휴식`, `이동`, `수면` 7개로 단순화했다.
- 기존 저장값 표시가 깨지지 않도록 기존 카테고리를 새 유형 라벨로 매핑했다.
- 기존 `paper_review`는 `coding_study`, `onboarding_log`는 `company_work`로 수정 폼 초기값을 정규화했다.
- 시간 기록 작성/수정 폼에서 만족도 입력 필드를 제거했다.
- 시간 기록 목록/타임라인과 상세 화면에서 만족도 표시를 제거했다.
- 월간 캘린더 날짜 칸에 해당 날짜의 시간 기록 `activity`를 최대 2개까지 표시하고, 초과분은 `+N개`로 표시했다.
- 월간 기록이 있는 날짜는 은은한 배경/border로 구분하고 오늘 날짜는 강조했다.
- 월간 기록이 없을 때 `아직 이번 달 시간 기록이 없습니다.` 빈 상태를 표시했다.
- 이번 주 루틴 현황을 `time_logs.activity` 단순 나열이 아니라 고정 반복 행동 체크보드 형태로 변경했다.
- 주간 루틴 보드는 `개발 공부`, `업무 집중`, `운동`, `회고 작성` 행과 월~일 열로 표시한다.
- 현재 별도 루틴 완료 데이터가 없으므로 관련 시간 기록의 카테고리/활동명 키워드를 임시 완료 기준으로 사용했다.
- 오늘의 시간 기록을 오늘 날짜 기준 타임라인으로 변경했다.
- 오늘의 시간 기록 상단에 하루 총 기록 시간을 표시했다.
- 기존 시간 기록 추가 버튼, 라우트, query layer, CRUD 흐름은 유지했다.

## 구현하지 않은 것

- DB schema 변경
- RLS policy 변경
- 인증 구조 변경
- 별도 루틴 완료 테이블 추가
- 외부 캘린더 연동
- 차트, AI, 알림, Storage, 파일 업로드 API
- 노트/업무/미팅/회고 기능 수정
- 만족도 컬럼 삭제

## 생성한 파일

- `logs/2026-05-10-0407-routine-daily-time-view-refinement.md`

## 수정한 파일

- `src/components/routines/RoutineProgressSummary.tsx`
- `src/components/routines/TimeLogDetail.tsx`
- `src/components/routines/TimeLogForm.tsx`
- `src/components/routines/TimeLogsList.tsx`
- `src/lib/routines/timeLogs.ts`

## 실행한 검증

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npx.cmd tsc --noEmit --incremental false`
- `npm.cmd run build`
- `rg "업무 유형" src`
- `rg "satisfaction" src\\components\\routines\\TimeLogForm.tsx src\\components\\routines\\TimeLogsList.tsx src\\components\\routines\\TimeLogDetail.tsx src\\lib\\routines\\timeLogs.ts`
- `rg "client\\.from|supabase\\.from" src\\app src\\components`
- `git -c safe.directory=C:/huniii/test/time-tracker diff --stat`
- `git -c safe.directory=C:/huniii/test/time-tracker status --short`

## 검증 결과

- 타입 체크: 통과
  - sandbox에서는 `tsconfig.tsbuildinfo` 쓰기 권한 문제로 `npm.cmd run typecheck`가 실패했다.
  - `npx.cmd tsc --noEmit --incremental false`는 통과했다.
  - 승인된 환경에서 `npm.cmd run typecheck`도 통과했다.
- 린트: 통과
- 빌드: 통과
  - sandbox에서는 `next build`가 완료 출력 없이 타임아웃됐다.
  - 승인된 환경에서 `npm.cmd run build`는 통과했다.
- `업무 유형` 문자열: 없음
- 시간 기록 폼/목록/상세/timeLogs 유틸 내 `satisfaction` 참조: 없음
- `src/app`, `src/components` 내 직접 `.from(...)` 호출: 없음
- DB schema/RLS 변경: 없음
- 불필요한 라이브러리 추가: 없음

## 범위 초과 여부

- 범위 초과 없음.
- 루틴 데일리 시간 탭, 시간 기록 작성/수정 폼, 시간 기록 상세 표시만 수정했다.

## 현재 한계

- `TimeLogCategory` 타입과 DB 저장값은 기존 enum을 유지한다. 새 UI 유형은 기존 enum 값에 매핑해서 표현한다.
- 새 UI의 `여가 활동`은 기존 `other` 값으로 저장된다.
- 별도 루틴 완료 데이터가 없으므로 이번 주 루틴 현황은 시간 기록 카테고리와 활동명 키워드를 임시 완료 기준으로 사용한다.
- 위클리 피드백의 `루틴 만족도`는 시간 기록 만족도와 별도 기능이므로 이번 범위에서 수정하지 않았다.

## 다음 추천 작업

- 고정 루틴 이름과 완료 여부를 사용자가 직접 관리해야 한다면 별도 루틴 완료 데이터 모델과 CRUD 범위를 다음 마일스톤에 명시한다.
- 시간 기록 카테고리 enum 자체를 새 7개 유형으로 바꾸려면 DB enum/schema 마이그레이션을 별도 작업으로 설계한다.
