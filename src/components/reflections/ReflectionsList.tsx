"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DashboardCard, EmptyState, GhostButton, MetricCard, Pill, PrimaryButton } from "@/components/common/ui";
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
        setError("Login is required.");
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
    return <DashboardCard>Loading reflections...</DashboardCard>;
  }

  const latestReflection = reflections[0];

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-[#78716c]">{error}</p> : null}

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <DashboardCard className="rounded-2xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-medium text-[#78716c]">Today reflection</p>
              <h2 className="mt-2 text-xl font-semibold text-[#0c0a09]">Write today</h2>
              <p className="mt-2 text-sm leading-6 text-[#78716c]">
                Capture what you learned, what was difficult, and what to try tomorrow.
              </p>
            </div>
            <Link href="/reflections/new">
              <PrimaryButton>Write</PrimaryButton>
            </Link>
          </div>
        </DashboardCard>
        <MetricCard
          detail={latestReflection ? latestReflection.reflection_date : "No recent reflection yet."}
          label="Total reflections"
          value={`${reflections.length}`}
        />
      </div>

      {reflections.length === 0 ? (
        <DashboardCard>
          <EmptyState description="Write a short reflection and decide tomorrow's next action." title="No reflections yet." />
        </DashboardCard>
      ) : (
        <div className="space-y-3">
          {reflections.map((reflection) => {
            const isOpen = openReflectionId === reflection.id;
            const tags = buildReflectionTags(reflection);
            const formattedDate = formatReflectionDate(reflection.reflection_date);

            return (
              <DashboardCard key={reflection.id}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <h2 className="text-xl font-semibold tracking-normal text-[#0c0a09]">
                        {formattedDate.date}
                      </h2>
                      <span className="text-sm font-medium text-[#78716c]">{formattedDate.weekday}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Pill key={`${reflection.id}-${tag}`}>#{tag}</Pill>
                      ))}
                    </div>
                  </div>
                  <div className="flex shrink-0 justify-end gap-2 sm:self-end">
                    <button onClick={() => setOpenReflectionId(isOpen ? null : reflection.id)} type="button">
                      <GhostButton>{isOpen ? "Close" : "View"}</GhostButton>
                    </button>
                    <Link href={`/reflections/${reflection.id}/edit`}>
                      <PrimaryButton>Edit</PrimaryButton>
                    </Link>
                  </div>
                </div>

                {isOpen ? (
                  <div className="mt-5 border-t border-[#e5e7eb] pt-4">
                    <dl className="grid gap-4 text-sm sm:grid-cols-2">
                      {[
                        ["Learned", reflection.learned],
                        ["Difficult", reflection.difficult],
                        ["Good", reflection.good],
                        ["Tomorrow action", reflection.tomorrow_action],
                      ].map(([label, value]) => (
                        <div className="rounded-[10px] border border-[#e5e7eb] bg-[#fafaf9] p-3" key={label}>
                          <dt className="text-xs font-medium text-[#78716c]">{label}</dt>
                          <dd className="mt-1 whitespace-pre-wrap leading-6 text-[#0c0a09]">{value || "-"}</dd>
                        </div>
                      ))}
                    </dl>
                    {(reflection.communication_lesson || reflection.technical_lesson || reflection.emotional_care) ? (
                      <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
                        {[
                          ["Communication", reflection.communication_lesson],
                          ["Technical", reflection.technical_lesson],
                          ["Emotional care", reflection.emotional_care],
                        ].map(([label, value]) => (
                          <div className="rounded-[10px] border border-[#e5e7eb] bg-white p-3" key={label}>
                            <dt className="text-xs font-medium text-[#78716c]">{label}</dt>
                            <dd className="mt-1 whitespace-pre-wrap leading-6 text-[#0c0a09]">{value || "-"}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}
                  </div>
                ) : null}
              </DashboardCard>
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

  return source.trim() ? ["reflection"] : ["daily"];
}

const reflectionTagStopWords = new Set(["today", "tomorrow", "and", "but", "the", "a"]);
