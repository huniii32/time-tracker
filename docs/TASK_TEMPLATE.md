# TASK TEMPLATE

아래 템플릿을 복사해서 Codex 작업 요청에 사용한다.

````markdown
# Codex 작업 요청

## 이번 작업 마일스톤

-

## 작업 목표

-

## 구현할 것

-

## 구현하지 말 것

-

## 수정 가능 파일

-

## 수정 금지 파일

-

## 완료 기준

-

## 검증 방법

```text
npm run typecheck
npm run lint
rg 'supabase[.]from|client[.]from' src/app src/components
git diff --stat
git status --short
```

주의:

- Codex 환경에서는 build를 실행하지 않는다.
- build 검증은 사용자가 로컬 환경에서 직접 수행한다.

## 보고 형식

### 구현한 것

### 생성/수정한 파일

### 구현하지 않은 것

### 검증 결과

### 현재 프로젝트 상태

### 다음 추천 작업

### 주의해야 할 점
````
