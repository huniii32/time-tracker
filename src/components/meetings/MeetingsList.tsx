"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/common/Card";
import { listMeetings, updateMeeting } from "@/lib/queries/meetings";
import { createClient } from "@/lib/supabase/browser";
import type { Meeting } from "@/types";
import { ReflectedBadge } from "./MeetingBadges";

type Filter = "all" | "unreflected";

export function MeetingsList() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadMeetings() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      const { data, error: listError } = await listMeetings(supabase, user.id);

      if (listError) {
        setError(listError.message);
      } else {
        setMeetings(data ?? []);
      }

      setLoading(false);
    }

    void loadMeetings();
  }, []);

  const filteredMeetings = useMemo(() => {
    if (filter === "unreflected") {
      return meetings.filter((meeting) => !meeting.reflected);
    }

    return meetings;
  }, [filter, meetings]);

  async function handleReflectedChange(meeting: Meeting, reflected: boolean) {
    setError("");
    setUpdatingId(meeting.id);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("로그인이 필요합니다.");
      setUpdatingId(null);
      return;
    }

    const { data, error: updateError } = await updateMeeting(
      supabase,
      user.id,
      meeting.id,
      { reflected },
    );

    if (updateError) {
      setError(updateError.message);
    } else if (data) {
      setMeetings((current) => current.map((item) => (item.id === data.id ? data : item)));
    }

    setUpdatingId(null);
  }

  if (loading) {
    return <Card>미팅을 불러오는 중입니다.</Card>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm">
        <label className="block text-sm font-semibold text-[#1F2F5C]">
          반영 여부 필터
          <select
            className="mt-1 w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-3 text-base"
            onChange={(event) => setFilter(event.target.value as Filter)}
            value={filter}
          >
            <option value="all">전체 회의</option>
            <option value="unreflected">미반영 회의</option>
          </select>
        </label>
      </div>

      {error ? <p className="text-sm text-[#C92735]">{error}</p> : null}

      {filteredMeetings.length === 0 ? (
        <Card>
          <h2 className="font-semibold text-[#1F2F5C]">아직 미팅 기록이 없습니다.</h2>
          <p className="mt-2 text-sm text-[#6B7280]">
            결정사항과 내 액션아이템을 첫 미팅 기록으로 남겨보세요.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredMeetings.map((meeting) => (
            <Card className={!meeting.reflected ? "border-[#C92735]" : ""} key={meeting.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2">
                    <ReflectedBadge reflected={meeting.reflected} />
                    {meeting.due_date ? (
                      <span className="rounded bg-[#F7F8FA] px-2 py-1 text-xs text-[#374151]">
                        마감 {meeting.due_date}
                      </span>
                    ) : null}
                  </div>
                  <Link href={`/meetings/${meeting.id}`}>
                    <h2 className="mt-2 text-lg font-bold text-[#1F2F5C]">
                      {meeting.title}
                    </h2>
                  </Link>
                  <p className="mt-1 text-sm text-[#6B7280]">
                    {meeting.meeting_date} · 참석자{" "}
                    {meeting.attendees.length > 0 ? meeting.attendees.join(", ") : "-"}
                  </p>
                </div>
                <label className="flex shrink-0 items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-2 py-2 text-sm text-[#374151]">
                  <input
                    checked={meeting.reflected}
                    disabled={updatingId === meeting.id}
                    onChange={(event) =>
                      void handleReflectedChange(meeting, event.target.checked)
                    }
                    type="checkbox"
                  />
                  반영
                </label>
              </div>

              {meeting.decisions ? (
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#374151]">
                  결정사항: {meeting.decisions}
                </p>
              ) : null}
              {meeting.action_items ? (
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#374151]">
                  액션아이템: {meeting.action_items}
                </p>
              ) : null}
              {meeting.tags.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {meeting.tags.map((tag) => (
                    <span className="rounded bg-[#F7F8FA] px-2 py-1 text-xs" key={tag}>
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
