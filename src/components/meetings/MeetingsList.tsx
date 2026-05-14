"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DashboardCard, EmptyState, MetricCard, Pill } from "@/components/common/ui";
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
        setError("Login is required.");
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
      setError("Login is required.");
      setUpdatingId(null);
      return;
    }

    const { data, error: updateError } = await updateMeeting(supabase, user.id, meeting.id, { reflected });

    if (updateError) {
      setError(updateError.message);
    } else if (data) {
      setMeetings((current) => current.map((item) => (item.id === data.id ? data : item)));
    }

    setUpdatingId(null);
  }

  if (loading) {
    return <DashboardCard>Loading meetings...</DashboardCard>;
  }

  const unreflectedCount = meetings.filter((meeting) => !meeting.reflected).length;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="All meetings" value={`${meetings.length}`} />
        <MetricCard label="Open" value={`${unreflectedCount}`} />
        <MetricCard label="Reflected" value={`${meetings.length - unreflectedCount}`} />
      </div>

      <DashboardCard className="p-4 sm:p-4">
        <label className="block text-sm font-medium text-[#78716c]">
          Reflection filter
          <select
            className="mt-2 w-full rounded-[10px] border border-[#d6d3d1] bg-white px-3 py-2.5 text-sm text-[#0c0a09] focus:border-[#3ba6f1] focus:outline-none focus:ring-2 focus:ring-[#c1e1f7]"
            onChange={(event) => setFilter(event.target.value as Filter)}
            value={filter}
          >
            <option value="all">All meetings</option>
            <option value="unreflected">Open meetings</option>
          </select>
        </label>
      </DashboardCard>

      {error ? <p className="text-sm text-[#78716c]">{error}</p> : null}

      {filteredMeetings.length === 0 ? (
        <DashboardCard>
          <EmptyState description="Record decisions and action items from a meeting." title="No meeting records yet." />
        </DashboardCard>
      ) : (
        <div className="space-y-3">
          {filteredMeetings.map((meeting) => (
            <DashboardCard className={!meeting.reflected ? "border-[#d6d3d1]" : ""} key={meeting.id}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2">
                    <ReflectedBadge reflected={meeting.reflected} />
                    {meeting.due_date ? <Pill>Due {meeting.due_date}</Pill> : null}
                  </div>
                  <Link href={`/meetings/${meeting.id}`}>
                    <h2 className="mt-3 text-lg font-semibold text-[#0c0a09]">{meeting.title}</h2>
                  </Link>
                  <p className="mt-1 text-sm text-[#78716c]">
                    {meeting.meeting_date} · {meeting.attendees.length > 0 ? meeting.attendees.join(", ") : "-"}
                  </p>
                </div>
                <label className="flex w-fit shrink-0 items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#78716c]">
                  <input
                    checked={meeting.reflected}
                    disabled={updatingId === meeting.id}
                    onChange={(event) => void handleReflectedChange(meeting, event.target.checked)}
                    type="checkbox"
                  />
                  Reflected
                </label>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {meeting.decisions ? (
                  <div className="rounded-[10px] border border-[#e5e7eb] bg-[#fafaf9] p-3">
                    <p className="text-xs font-medium text-[#78716c]">Decisions</p>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#0c0a09]">{meeting.decisions}</p>
                  </div>
                ) : null}
                {meeting.action_items ? (
                  <div className="rounded-[10px] border border-[#e5e7eb] bg-[#fafaf9] p-3">
                    <p className="text-xs font-medium text-[#78716c]">Action items</p>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#0c0a09]">{meeting.action_items}</p>
                  </div>
                ) : null}
              </div>

              {meeting.tags.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {meeting.tags.map((tag) => (
                    <Pill key={tag}>#{tag}</Pill>
                  ))}
                </div>
              ) : null}
            </DashboardCard>
          ))}
        </div>
      )}
    </div>
  );
}
