"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/common/Card";
import { listReflections } from "@/lib/queries/reflections";
import { createClient } from "@/lib/supabase/browser";
import type { Reflection } from "@/types";

export function ReflectionsList() {
  const [reflections, setReflections] = useState<Reflection[]>([]);
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
          <h2 className="font-semibold text-[#1F2F5C]">아직 회고가 없습니다.</h2>
          <p className="mt-2 text-sm text-[#6B7280]">
            오늘 배운 점과 내일 적용할 행동을 첫 회고로 남겨보세요.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {reflections.map((reflection) => (
            <Link className="block" href={`/reflections/${reflection.id}`} key={reflection.id}>
              <Card>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="rounded bg-[#EAF1FF] px-2 py-1 text-xs font-semibold text-[#1F2F5C]">
                      {reflection.reflection_date}
                    </span>
                    <h2 className="mt-2 text-lg font-bold text-[#1F2F5C]">
                      {reflection.learned}
                    </h2>
                  </div>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-[#374151] sm:grid-cols-2">
                  <p className="line-clamp-2">
                    <span className="font-semibold text-[#6B7280]">어려웠던 점: </span>
                    {reflection.difficult || "-"}
                  </p>
                  <p className="line-clamp-2">
                    <span className="font-semibold text-[#6B7280]">잘한 점: </span>
                    {reflection.good || "-"}
                  </p>
                </div>
                {reflection.tomorrow_action ? (
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#374151]">
                    내일 적용할 행동: {reflection.tomorrow_action}
                  </p>
                ) : null}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
