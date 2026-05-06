import { Card } from "./Card";

type PlaceholderPanelProps = {
  title: string;
  description: string;
};

export function PlaceholderPanel({ description, title }: PlaceholderPanelProps) {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-[#1F2F5C]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[#6B7280]">{description}</p>
      <p className="mt-4 rounded-lg bg-[#F7F8FA] px-3 py-2 text-sm text-[#6B7280]">
        이 화면은 Milestone 1 placeholder입니다.
      </p>
    </Card>
  );
}
