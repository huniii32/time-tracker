"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/common/Card";
import {
  deleteReflection,
  getReflection,
} from "@/lib/queries/reflections";
import { createClient } from "@/lib/supabase/browser";
import type { Reflection } from "@/types";

export function ReflectionDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadReflection() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data, error: reflectionError } = await getReflection(
        supabase,
        user.id,
        params.id,
      );

      if (reflectionError) {
        setError(reflectionError.message);
      } else {
        setReflection(data);
      }

      setLoading(false);
    }

    void loadReflection();
  }, [params.id, router]);

  async function handleDelete() {
    if (!reflection || !confirm("이 회고를 삭제할까요?")) {
      return;
    }

    setDeleting(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const { error: deleteError } = await deleteReflection(supabase, user.id, reflection.id);

    if (deleteError) {
      setError(deleteError.message);
      setDeleting(false);
      return;
    }

    router.replace("/reflections");
    router.refresh();
  }

  if (loading) {
    return <Card>회고를 불러오는 중입니다.</Card>;
  }

  if (!reflection) {
    return (
      <Card>
        <h2 className="font-semibold text-[#1F2F5C]">회고를 찾을 수 없습니다.</h2>
        {error ? <p className="mt-2 text-sm text-[#C92735]">{error}</p> : null}
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <span className="rounded bg-[#EAF1FF] px-2 py-1 text-xs font-semibold text-[#1F2F5C]">
          {reflection.reflection_date}
        </span>
        <h2 className="mt-3 text-2xl font-bold text-[#1F2F5C]">하루 회고</h2>
      </Card>

      <Card>
        <dl className="space-y-4">
          {[
            ["오늘 배운 점", reflection.learned],
            ["오늘 어려웠던 점", reflection.difficult],
            ["오늘 잘한 점", reflection.good],
            ["내일 적용할 행동", reflection.tomorrow_action],
            ["커뮤니케이션 인사이트", reflection.communication_lesson],
            ["기술 인사이트", reflection.technical_lesson],
            ["감정 관리 포인트", reflection.emotional_care],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-semibold text-[#6B7280]">{label}</dt>
              <dd className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#111827]">
                {value || "-"}
              </dd>
            </div>
          ))}
        </dl>
      </Card>

      {error ? <p className="text-sm text-[#C92735]">{error}</p> : null}

      <div className="grid grid-cols-2 gap-3">
        <Link
          className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-center text-sm font-bold text-[#1F2F5C]"
          href={`/reflections/${reflection.id}/edit`}
        >
          수정
        </Link>
        <button
          className="rounded-lg bg-[#C92735] px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
          disabled={deleting}
          onClick={() => void handleDelete()}
          type="button"
        >
          {deleting ? "삭제 중" : "삭제"}
        </button>
      </div>
    </div>
  );
}
