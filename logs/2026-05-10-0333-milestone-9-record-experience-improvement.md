# 작업 로그: Milestone 9 기록 경험 고도화

## 작업 목표

노트 작성/수정 화면에 프론트엔드 상태 기반 이미지 첨부 UI를 추가하고, 루틴 데일리 시간 탭에 월간 캘린더와 이번 주 루틴 현황 UI를 추가한다.

## 구현한 것

- 노트 작성/수정 폼에 `images: NoteImage[]` 상태를 추가했다.
- 업무노트, 관계노트, 회사 용어사전, 학습노트에 해당하는 기존 노트 유형에서 이미지 첨부 UI를 사용할 수 있게 했다.
- `jpg`, `jpeg`, `png`, `webp` 형식 이미지 선택, 여러 장 첨부, 썸네일 미리보기, 삭제, 확대 미리보기 모달, 이미지별 설명 입력을 구현했다.
- 이미지 관련 처리를 `handleImageUpload`, `handleImageRemove`, `handleImagePreview`, `handleImageDescriptionChange` 함수로 분리했다.
- 루틴 데일리 시간 탭 상단에 현재 월 기준 월간 캘린더를 추가했다.
- 날짜별 시간 기록 존재 여부를 루틴 완료 상태로 표시하고 오늘 날짜를 강조했다.
- 월간 기록이 없을 때 `아직 이번 달 루틴 기록이 없습니다.` 빈 상태를 표시했다.
- 월간 캘린더 아래에 `이번 주 루틴 현황`을 추가했다.
- 월~일 기준 주간 날짜와 활동별 완료 여부를 체크 형태로 표시했다.
- 주간 기록이 없을 때 `아직 이번 주 루틴 기록이 없습니다.` 빈 상태를 표시했다.
- 기존 시간 기록 목록과 시간 기록 추가 동작은 유지했다.

## 구현하지 않은 것

- Supabase Storage 연동
- 파일 업로드 서버 API
- 이미지 영구 저장
- DB schema 변경
- RLS policy 변경
- 인증 구조 변경
- 외부 캘린더 연동
- 차트, AI, OCR, 알림 기능
- 노트/루틴 외 다른 도메인 CRUD 수정

## 생성한 파일

- `src/components/routines/RoutineProgressSummary.tsx`
- `logs/2026-05-10-0333-milestone-9-record-experience-improvement.md`

## 수정한 파일

- `src/components/notes/NoteForm.tsx`
- `src/lib/notes/form.ts`
- `src/components/routines/TimeLogsList.tsx`

## 실행한 검증

- `npm.cmd run typecheck`
- `npx.cmd tsc --noEmit --incremental false`
- `npm.cmd run lint`
- `npm.cmd run build`
- `rg "client\\.from|supabase\\.from" src\\app src\\components`
- `git -c safe.directory=C:/huniii/test/time-tracker diff --stat`
- `git -c safe.directory=C:/huniii/test/time-tracker status --short`

## 검증 결과

- 타입 체크: 통과
  - 최초 `npm.cmd run typecheck`는 sandbox에서 `tsconfig.tsbuildinfo` 쓰기 권한 문제로 실패했다.
  - `npx.cmd tsc --noEmit --incremental false`는 통과했다.
  - 이후 승인된 환경에서 `npm.cmd run typecheck`도 통과했다.
- 린트: 통과
- 빌드: 통과
  - sandbox에서는 `next build`가 완료 출력 없이 타임아웃됐다.
  - 승인된 환경에서 `npm.cmd run build`는 정상 통과했다.
- `src/app`, `src/components` 내 Supabase table query 직접 호출: 없음
- DB schema/RLS 변경: 없음
- 불필요한 라이브러리 추가: 없음

## 범위 초과 여부

- 범위 초과 없음.
- Milestone 9의 노트 이미지 첨부 UI와 루틴 데일리 시간 탭 UI 개선만 진행했다.

## 현재 한계

- 이미지 첨부는 DB 저장 없이 프론트엔드 미리보기 상태로만 동작한다.
- 수정 화면에서도 기존 저장 이미지 로딩은 없으며, 현재 세션에서 새로 추가한 이미지에 대해서만 추가/삭제/설명 입력이 가능하다.
- 별도 루틴 완료 테이블이 없으므로 이번 주 루틴 현황은 기존 `time_logs`의 `activity`와 `log_date`를 기준으로 표시한다.
- 작업 전부터 `AGENTS.md`, `docs/MILESTONES.md`, `docs/PRD.md`, `docs/ROADMAP.md`에 변경/추가 상태가 있었다. 이번 작업에서는 해당 문서들을 수정하지 않았다.

## 다음 추천 작업

- 다음 마일스톤에서 이미지 영구 저장이 필요하면 Supabase Storage 또는 파일 업로드 API와 DB 저장 구조를 별도 작업으로 설계한다.
- 루틴 완료 여부를 시간 기록과 분리해야 하면 별도 루틴 완료 데이터 모델을 마일스톤에 명시한 뒤 추가한다.
