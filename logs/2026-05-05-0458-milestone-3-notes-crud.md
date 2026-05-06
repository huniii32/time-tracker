# Milestone 3 Notes CRUD

## 작업명

Milestone 3: 노트 CRUD 구현

## 작업 목표

로그인한 사용자가 회사 적응에 필요한 노트를 생성, 조회, 상세 확인, 수정, 삭제할 수 있게 한다.

## 구현한 것

- 노트 메인 화면
- 노트 목록 조회
- 노트 타입 필터
- 제목/내용/태그 검색
- 노트 작성 화면
- 노트 상세 화면
- 노트 수정 화면
- 노트 삭제 동작
- 노트 타입별 입력 항목 구성
- 태그 입력 및 표시
- 현재 로그인한 사용자 기준 notes query 사용
- 컴포넌트에서 직접 Supabase table query를 호출하지 않고 `src/lib/queries/notes.ts` 사용

## 구현하지 않은 것

- 업무 CRUD
- 미팅 CRUD
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

## 생성한 파일

- `src/app/notes/new/page.tsx`
- `src/app/notes/[id]/page.tsx`
- `src/app/notes/[id]/edit/page.tsx`
- `src/components/notes/NoteForm.tsx`
- `src/components/notes/NotesList.tsx`
- `src/components/notes/NoteDetail.tsx`
- `src/components/notes/EditNoteLoader.tsx`
- `src/components/notes/NoteTypeBadge.tsx`
- `src/lib/notes/config.ts`
- `src/lib/notes/form.ts`
- `logs/2026-05-05-0458-milestone-3-notes-crud.md`

## 수정한 파일

- `src/app/notes/page.tsx`
- `src/lib/queries/client.ts`
- `src/lib/supabase/browser.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/middleware.ts`

## 실행한 검증

- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run build`
- `src/app`, `src/components` 내 직접 `.from(...)` 호출 검색
- 노트 범위 밖 CRUD 구현 검색

## 검증 결과

- 타입 체크: 통과
- 린트: 통과
- 빌드: 통과
- 직접 Supabase table query: `src/app`, `src/components` 내 없음
- 노트 외 화면 CRUD 구현: 없음
- Next.js build routes:
  - `/notes`
  - `/notes/new`
  - `/notes/[id]`
  - `/notes/[id]/edit`

## 범위 초과 여부

범위 초과 없음. 노트 CRUD 외 기능은 구현하지 않았다.

## 현재 한계

- 실제 로그인 계정으로 브라우저에서 생성/수정/삭제까지 수동 검증은 수행하지 않았다.
- DB schema와 RLS는 변경하지 않았다.
- 노트 검색은 DB full-text search가 아니라 클라이언트 목록 필터 방식이다.

## 다음 추천 작업

브라우저에서 실제 로그인 후 회사노트, 감정노트, 학습노트를 각각 생성/상세/수정/삭제해 RLS와 사용자별 데이터 격리를 수동 검증한다.
