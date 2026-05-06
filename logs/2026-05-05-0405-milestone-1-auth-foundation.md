# Milestone 1 Auth Foundation

## 작업명

Milestone 1: 인증 기반 구축

## 작업 목표

로그인 기반 웹앱의 최소 기반을 구축한다. Supabase Auth를 사용할 수 있는 연결 준비, 인증 화면, 보호 라우트, AppShell, Header, BottomNav, 홈 skeleton, 탭 placeholder를 만든다.

## 구현한 것

- Next.js App Router 프로젝트 설정
- TypeScript, Tailwind CSS, ESLint 설정
- Supabase browser/server client 준비
- Supabase 세션 갱신 및 접근 제어 middleware
- 로그인 페이지
- 회원가입 페이지
- 로그아웃 버튼
- AppShell 레이아웃
- Header
- BottomNav
- 홈 skeleton
- 노트, 업무, 루틴, 회고 placeholder 페이지
- 환경 변수 예시 파일

## 구현하지 않은 것

- 노트 CRUD
- 업무 CRUD
- 미팅 CRUD
- 루틴 CRUD
- 회고 CRUD
- 차트
- AI 기능
- 캘린더 연동
- 샘플 데이터 자동 생성
- 복잡한 홈 대시보드 계산
- 전체 Supabase 테이블 구현
- Supabase DB 쿼리 레이어

## 생성한 파일

- `.env.example`
- `.gitignore`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `next-env.d.ts`
- `next.config.ts`
- `postcss.config.js`
- `tailwind.config.ts`
- `eslint.config.mjs`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/app/page.tsx`
- `src/app/login/page.tsx`
- `src/app/signup/page.tsx`
- `src/app/notes/page.tsx`
- `src/app/tasks/page.tsx`
- `src/app/routines/page.tsx`
- `src/app/reflections/page.tsx`
- `src/components/common/Card.tsx`
- `src/components/common/PlaceholderPanel.tsx`
- `src/components/layout/AppShell.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/BottomNav.tsx`
- `src/components/layout/SignOutButton.tsx`
- `src/lib/supabase/browser.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/middleware.ts`
- `src/middleware.ts`

## 수정한 파일

- 없음

## 실행한 검증

- `npm.cmd install`
- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run build`
- 로컬 dev 서버에서 비로그인 `/` 접근 확인
- 로컬 dev 서버에서 `/login` 렌더링 확인
- 범위 초과 구현 검색

## 검증 결과

- 타입 체크: 통과
- 린트: 통과
- 빌드: 통과
- 비로그인 `/` 접근: `307 Temporary Redirect`로 `/login?missingEnv=1` 이동 확인
- `/login`: `200 OK` 확인
- Middleware: production build 결과에 포함 확인
- 범위 초과 구현: CRUD 쿼리 없음

## 범위 초과 여부

범위 초과 없음.

## 현재 한계

- 실제 회원가입/로그인 성공 흐름은 Supabase 환경 변수와 프로젝트 설정이 필요하다.
- 현재 DB 테이블과 RLS 정책은 구현하지 않았다.
- 홈과 탭 화면은 skeleton/placeholder만 제공한다.

## 다음 추천 작업

Supabase 프로젝트를 준비하고 `.env.local`에 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`를 설정한 뒤 실제 회원가입/로그인 흐름을 확인한다.
