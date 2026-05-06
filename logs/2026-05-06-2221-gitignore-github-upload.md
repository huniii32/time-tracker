# 작업명

GitHub 업로드 제외 파일 정리

# 작업 목표

GitHub에 올리지 말아야 할 로컬 산출물, 비밀값, 캐시 파일을 `.gitignore`에 정리한다.

# 구현한 것

- `.gitignore` 보강
- `node_modules`, `.next`, `out`, `.vercel` 제외
- `.env`, `.env.*` 제외 및 `.env.example` 예외 처리
- `*.tsbuildinfo` 제외
- 로그 파일 패턴 제외
- Supabase 로컬 상태 폴더 제외
- OS/IDE 로컬 파일 제외

# 구현하지 않은 것

- `supabase/migrations` 제외 처리
- 소스 코드, 문서, 작업 로그 삭제
- GitHub push 실행

# 생성한 파일

- `logs/2026-05-06-2221-gitignore-github-upload.md`

# 수정한 파일

- `.gitignore`

# 실행한 검증

- `Get-Content -LiteralPath .gitignore`
- `git status --short`

# 검증 결과

- `.gitignore` 내용 확인 완료
- 현재 폴더는 git 저장소가 아니어서 `git status --short`는 실행 불가

# 범위 초과 여부

범위 초과 구현 없음.

# 현재 한계

- 아직 git 저장소로 초기화되어 있지 않아 실제 track 여부는 확인하지 못했다.

# 다음 추천 작업

`git init` 후 `git status --ignored`로 제외 대상이 의도대로 빠지는지 확인한다.
