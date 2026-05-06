"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/common/Card";
import { getTimeLog } from "@/lib/queries/timeLogs";
import { createClient } from "@/lib/supabase/browser";
import type { TimeLog } from "@/types";
import { TimeLogForm } from "./TimeLogForm";

export function EditTimeLogLoader() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [timeLog, setTimeLog] = useState<TimeLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTimeLog() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data, error: timeLogError } = await getTimeLog(supabase, user.id, params.id);

      if (timeLogError) {
        setError(timeLogError.message);
      } else {
        setTimeLog(data);
      }

      setLoading(false);
    }

    void loadTimeLog();
  }, [params.id, router]);

  if (loading) {
    return <Card>시간 기록을 불러오는 중입니다.</Card>;
  }

  if (!timeLog) {
    return (
      <Card>
        <h2 className="font-semibold text-[#1F2F5C]">시간 기록을 찾을 수 없습니다.</h2>
        {error ? <p className="mt-2 text-sm text-[#C92735]">{error}</p> : null}
      </Card>
    );
  }

  return <TimeLogForm mode="edit" timeLog={timeLog} />;
}
