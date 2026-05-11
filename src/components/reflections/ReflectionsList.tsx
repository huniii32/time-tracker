"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/common/Card";
import { listReflections } from "@/lib/queries/reflections";
import { createClient } from "@/lib/supabase/browser";
import type { Reflection } from "@/types";

export function ReflectionsList() {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [openReflectionId, setOpenReflectionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReflections() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      const { data, error: listError } = await listReflections(supabase, user.id);

      if (listError) {
        setError(listError.message);
      } else {
        setReflections(data ?? []);
      }

      setLoading(false);
    }

    void loadReflections();
  }, []);

  if (loading) {
    return <Card>회고를 불러오는 중입니다.</Card>;
  }

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-[#C92735]">{error}</p> : null}

      {reflections.length === 0 ? (
        <Card>
          <h2 className="font-semibold text-[#1F2F5C]">아직 작성된 회고가 없습니다.</h2>
          <p className="mt-2 text-sm text-[#6B7280]">
            오늘의 기록을 남기고 내일의 행동을 정리해보세요.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {reflections.map((reflection) => {
            const isOpen = openReflectionId === reflection.id;
            const tags = buildReflectionTags(reflection);
            const formattedDate = formatReflectionDate(reflection.reflection_date);

            return (
              <Card key={reflection.id}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <h2 className="text-xl font-extrabold tracking-normal text-[#1F2F5C]">
                        {formattedDate.date}
                      </h2>
                      <span className="text-sm font-bold text-[#667085]">{formattedDate.weekday}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          className="max-w-full truncate rounded-full bg-[#EEF4FF] px-3 py-1 text-xs font-bold text-[#1F2F5C]"
                          key={`${reflection.id}-${tag}`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex shrink-0 justify-end gap-2 sm:self-end">
                    <button
                      className="rounded-lg border border-[#CBD5E1] bg-white px-4 py-2 text-sm font-bold text-[#1F2F5C]"
                      onClick={() => setOpenReflectionId(isOpen ? null : reflection.id)}
                      type="button"
                    >
                      보기
                    </button>
                    <Link
                      className="rounded-lg bg-[#0B1F4D] px-4 py-2 text-sm font-extrabold text-white"
                      href={`/reflections/${reflection.id}/edit`}
                    >
                      수정
                    </Link>
                  </div>
                </div>

                {isOpen ? (
                  <div className="mt-5 border-t border-[#E5E7EB] pt-4">
                    <dl className="grid gap-4 text-sm sm:grid-cols-2">
                      {[
                        ["성과", reflection.learned],
                        ["어려웠던 점", reflection.difficult],
                        ["잘한 점", reflection.good],
                        ["내일 적용할 행동", reflection.tomorrow_action],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <dt className="text-xs font-bold text-[#667085]">{label}</dt>
                          <dd className="mt-1 whitespace-pre-wrap leading-6 text-[#111827]">{value || "-"}</dd>
                        </div>
                      ))}
                    </dl>
                    {(reflection.communication_lesson || reflection.technical_lesson || reflection.emotional_care) ? (
                      <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
                        {[
                          ["커뮤니케이션", reflection.communication_lesson],
                          ["기술", reflection.technical_lesson],
                          ["감정 관리", reflection.emotional_care],
                        ].map(([label, value]) => (
                          <div key={label}>
                            <dt className="text-xs font-bold text-[#667085]">{label}</dt>
                            <dd className="mt-1 whitespace-pre-wrap leading-6 text-[#111827]">{value || "-"}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}
                  </div>
                ) : null}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function formatReflectionDate(date: string) {
  const [year, month, day] = date.split("-");
  const weekday = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    weekday: "long",
  }).format(new Date(`${date}T12:00:00+09:00`));

  return {
    date: `${year}.${month}.${day}`,
    weekday,
  };
}

function buildReflectionTags(reflection: Reflection) {
  const source = [
    reflection.learned,
    reflection.difficult,
    reflection.good,
    reflection.tomorrow_action,
    reflection.communication_lesson,
    reflection.technical_lesson,
    reflection.emotional_care,
  ]
    .filter(Boolean)
    .join(" ");
  const keywords = source
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length >= 2 && word.length <= 12)
    .filter((word) => !reflectionTagStopWords.has(word));
  const uniqueKeywords = Array.from(new Set(keywords)).slice(0, 3);

  if (uniqueKeywords.length > 0) {
    return uniqueKeywords;
  }

  return source.trim() ? ["업무회고"] : ["하루회고"];
}

const reflectionTagStopWords = new Set([
  "오늘",
  "내일",
  "그리고",
  "하지만",
  "그래서",
  "점",
  "것",
  "수",
  "등",
  "더",
]);
