"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/common/Card";
import { getTask } from "@/lib/queries/tasks";
import { createClient } from "@/lib/supabase/browser";
import type { Task } from "@/types";
import { TaskForm } from "./TaskForm";

export function EditTaskLoader() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTask() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data, error: taskError } = await getTask(supabase, user.id, params.id);

      if (taskError) {
        setError(taskError.message);
      } else {
        setTask(data);
      }

      setLoading(false);
    }

    void loadTask();
  }, [params.id, router]);

  if (loading) {
    return <Card>업무를 불러오는 중입니다.</Card>;
  }

  if (!task) {
    return (
      <Card>
        <h2 className="font-semibold text-[#1F2F5C]">업무를 찾을 수 없습니다.</h2>
        {error ? <p className="mt-2 text-sm text-[#C92735]">{error}</p> : null}
      </Card>
    );
  }

  return <TaskForm mode="edit" task={task} />;
}
