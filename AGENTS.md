# AGENTS.md

## 프로젝트 목적

회사 적응기(Onboarding Tracker)는 개인용 회사 적응 기록 웹앱이다. 사용자가 로그인한 뒤 회사 문화, 업무, 루틴, 회고를 단계적으로 기록하고 관리할 수 있게 만든다.

## 기술 스택

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase PostgreSQL
- Vercel

## 작업 원칙

- 전체 MVP를 한 번에 구현하지 않는다.
- 한 번의 작업은 하나의 마일스톤만 진행한다.
- 요청하지 않은 기능을 구현하지 않는다.
- PRD는 참고 문서이며, 실제 범위는 `docs/MILESTONES.md`를 따른다.
- 현재 마일스톤의 제외 범위에 있는 기능은 절대 구현하지 않는다.
- 구현 후에는 반드시 `docs/HARNESS.md` 기준으로 검증한다.
- 검증 실패 시 완료 보고하지 않는다.

## PRD 해석 원칙

`docs/PRD.md`는 제품 전체 방향을 설명한다. PRD에 있는 기능이라도 현재 마일스톤에 포함되지 않으면 구현하지 않는다.

## 문서 참조 순서

1. `AGENTS.md`
2. `docs/MILESTONES.md`
3. 관련 `agents/*-agent.md`
4. `docs/HARNESS.md`
5. `docs/PRD.md`
6. `docs/TASK_TEMPLATE.md`
7. `docs/REVIEW_TEMPLATE.md`

## 금지사항

- 로그인, CRUD, Supabase 연결, UI 화면을 요청 없이 구현하지 않는다.
- 불필요한 라이브러리를 추가하지 않는다.
- 기존 구조를 임의로 삭제하지 않는다.
- 하네스 검증 없이 완료 보고하지 않는다.
- 마일스톤 밖 기능을 선행 구현하지 않는다.

## 작업 로그 규칙

모든 작업 완료 후 반드시 `logs/` 폴더에 작업 로그를 남긴다.

파일명은 다음 형식을 따른다.

`YYYY-MM-DD-HHMM-[milestone-name].md`

예시:

`logs/2026-05-05-2130-milestone-1-auth-foundation.md`

작업 로그에는 다음 항목을 포함한다.

- 작업명
- 작업 목표
- 구현한 것
- 구현하지 않은 것
- 생성한 파일
- 수정한 파일
- 실행한 검증
- 검증 결과
- 범위 초과 여부
- 현재 한계
- 다음 추천 작업

채팅 보고는 짧게 하고, 상세 내용은 로그 파일에 기록한다.
