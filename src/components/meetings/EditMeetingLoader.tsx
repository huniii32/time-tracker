"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/common/Card";
import { getMeeting } from "@/lib/queries/meetings";
import { createClient } from "@/lib/supabase/browser";
import type { Meeting } from "@/types";
import { MeetingForm } from "./MeetingForm";

export function EditMeetingLoader() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMeeting() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data, error: meetingError } = await getMeeting(supabase, user.id, params.id);

      if (meetingError) {
        setError(meetingError.message);
      } else {
        setMeeting(data);
      }

      setLoading(false);
    }

    void loadMeeting();
  }, [params.id, router]);

  if (loading) {
    return <Card>미팅을 불러오는 중입니다.</Card>;
  }

  if (!meeting) {
    return (
      <Card>
        <h2 className="font-semibold text-[#1F2F5C]">미팅을 찾을 수 없습니다.</h2>
        {error ? <p className="mt-2 text-sm text-[#C92735]">{error}</p> : null}
      </Card>
    );
  }

  return <MeetingForm meeting={meeting} mode="edit" />;
}
