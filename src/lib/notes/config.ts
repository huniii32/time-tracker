import type { NoteType } from "@/types";

export type NoteFieldKind = "text" | "textarea" | "number" | "select";

export type NoteFieldConfig = {
  name: string;
  label: string;
  kind: NoteFieldKind;
  required?: boolean;
  options?: string[];
};

export type NoteTypeConfig = {
  type: NoteType;
  label: string;
  description: string;
  fields: NoteFieldConfig[];
};

export const noteTypeConfigs: NoteTypeConfig[] = [
  {
    type: "company",
    label: "회사노트",
    description: "회사 문화, 업무 방식, 조직 내 암묵지, 반복적으로 들은 내용을 기록합니다.",
    fields: [
      { name: "department", label: "소속 또는 부서", kind: "text" },
      { name: "keyword", label: "키워드", kind: "text", required: true },
      { name: "learned", label: "알게 된 내용", kind: "textarea", required: true },
      { name: "importance", label: "왜 중요한가", kind: "textarea" },
      { name: "application", label: "내가 적용할 점", kind: "textarea" },
    ],
  },
  {
    type: "manager",
    label: "상사노트",
    description: "상사의 업무 스타일, 피드백 방식, 의사결정 기준을 관찰합니다.",
    fields: [
      { name: "situation", label: "상황", kind: "textarea", required: true },
      { name: "reaction", label: "상사의 반응", kind: "textarea" },
      { name: "criteria", label: "상사가 중요하게 본 기준", kind: "textarea" },
      { name: "missed", label: "내가 놓친 부분", kind: "textarea" },
      { name: "next_action", label: "다음에 적용할 행동", kind: "textarea" },
    ],
  },
  {
    type: "dictionary",
    label: "회사 단어 사전",
    description: "회사에서 자주 쓰는 용어, 약어, 프로젝트명, 내부 표현을 기록합니다.",
    fields: [
      { name: "term", label: "용어", kind: "text", required: true },
      { name: "meaning", label: "뜻", kind: "textarea", required: true },
      { name: "related_area", label: "관련 부서 또는 프로젝트", kind: "text" },
      { name: "context", label: "사용 맥락", kind: "textarea" },
      { name: "example", label: "예문", kind: "textarea" },
    ],
  },
  {
    type: "coworker",
    label: "동료노트",
    description: "동료, 선배, 협업자별 커뮤니케이션 방식과 협업 패턴을 기록합니다.",
    fields: [
      { name: "person", label: "이름 또는 역할", kind: "text", required: true },
      { name: "work_together", label: "함께 한 업무", kind: "textarea" },
      { name: "communication_style", label: "커뮤니케이션 특징", kind: "textarea" },
      { name: "good_method", label: "잘 맞았던 방식", kind: "textarea" },
      { name: "caution", label: "주의할 점", kind: "textarea" },
      { name: "next_collaboration", label: "다음 협업에서 적용할 점", kind: "textarea" },
    ],
  },
  {
    type: "emotion",
    label: "감정노트",
    description: "입사 초기 감정을 객관화하고 감정 소모를 줄이기 위해 기록합니다.",
    fields: [
      {
        name: "emotion",
        label: "오늘의 감정",
        kind: "select",
        required: true,
        options: ["불안", "긴장", "답답함", "성취감", "자신감", "피로", "혼란", "기대감"],
      },
      { name: "intensity", label: "감정 강도", kind: "number" },
      { name: "situation", label: "감정을 느낀 상황", kind: "textarea" },
      { name: "interpreted_cause", label: "내가 해석한 원인", kind: "textarea" },
      { name: "fact", label: "실제 사실", kind: "textarea" },
      { name: "next_response", label: "다음에 다르게 대응할 방법", kind: "textarea" },
      { name: "gratitude", label: "오늘 감사한 점", kind: "textarea" },
    ],
  },
  {
    type: "learning",
    label: "학습노트",
    description: "회사 업무에 필요한 기술, 논문, 도메인 지식, 코딩 공부를 관리합니다.",
    fields: [
      { name: "topic", label: "학습 주제", kind: "text", required: true },
      {
        name: "learning_type",
        label: "학습 유형",
        kind: "select",
        required: true,
        options: ["코딩", "논문 리뷰", "LLM", "RAG", "FastAPI", "Git", "회사 도메인", "기타"],
      },
      { name: "hours", label: "학습 시간", kind: "number" },
      { name: "key_points", label: "핵심 내용", kind: "textarea" },
      { name: "work_application", label: "업무 적용 가능성", kind: "textarea" },
      { name: "next_plan", label: "다음 학습 계획", kind: "textarea" },
    ],
  },
];

export function getNoteTypeConfig(noteType: NoteType) {
  return noteTypeConfigs.find((config) => config.type === noteType) ?? noteTypeConfigs[0];
}

export function getNoteTypeLabel(noteType: NoteType) {
  return getNoteTypeConfig(noteType).label;
}
