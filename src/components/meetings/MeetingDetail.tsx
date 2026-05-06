"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/common/Card";
import { deleteMeeting, getMeeting, updateMeeting } from "@/lib/queries/meetings";
import { createClient } from "@/lib/supabase/browser";
import type { Meeting } from "@/types";
import { ReflectedBadge } from "./MeetingBadges";

export function MeetingDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

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

  async function handleReflectedChange(reflected: boolean) {
    if (!meeting) {
      return;
    }

    setUpdating(true);
    setError("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
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
    } else {
      setMeeting(data);
    }

    setUpdating(false);
  }

  async function handleDelete() {
    if (!meeting || !confirm("이 미팅 기록을 삭제할까요?")) {
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

    const { error: deleteError } = await deleteMeeting(supabase, user.id, meeting.id);

    if (deleteError) {
      setError(deleteError.message);
      setDeleting(false);
      return;
    }

    router.replace("/meetings");
    router.refresh();
  }

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

  return (
    <div className="space-y-4">
      <Card className={!meeting.reflected ? "border-[#C92735]" : ""}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <ReflectedBadge reflected={meeting.reflected} />
            <h2 className="mt-3 text-2xl font-bold text-[#1F2F5C]">{meeting.title}</h2>
          </div>
          <label className="flex shrink-0 items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-2 py-2 text-sm text-[#374151]">
            <input
              checked={meeting.reflected}
              disabled={updating}
              onChange={(event) => void handleReflectedChange(event.target.checked)}
              type="checkbox"
            />
            반영
          </label>
        </div>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-[#6B7280]">날짜</dt>
            <dd className="mt-1 text-[#111827]">{meeting.meeting_date}</dd>
          </div>
          <div>
            <dt className="font-semibold text-[#6B7280]">마감기한</dt>
            <dd className="mt-1 text-[#111827]">{meeting.due_date ?? "-"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-semibold text-[#6B7280]">참석자</dt>
            <dd className="mt-1 text-[#111827]">
              {meeting.attendees.length > 0 ? meeting.attendees.join(", ") : "-"}
            </dd>
          </div>
        </dl>
        {meeting.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {meeting.tags.map((tag) => (
              <span className="rounded bg-[#F7F8FA] px-2 py-1 text-xs" key={tag}>
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </Card>

      <Card>
        <dl className="space-y-4">
          {[
            ["주요 논의 내용", meeting.discussion],
            ["결정사항", meeting.decisions],
            ["액션아이템", meeting.action_items],
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
          href={`/meetings/${meeting.id}/edit`}
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
