"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/common/Card";
import { getReflection } from "@/lib/queries/reflections";
import { createClient } from "@/lib/supabase/browser";
import type { Reflection } from "@/types";
import { ReflectionForm } from "./ReflectionForm";

export function EditReflectionLoader() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return <ReflectionForm mode="edit" reflection={reflection} />;
}
