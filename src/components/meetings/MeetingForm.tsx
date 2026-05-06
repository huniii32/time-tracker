"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { createMeeting, updateMeeting } from "@/lib/queries/meetings";
import { createClient } from "@/lib/supabase/browser";
import {
  buildMeetingInsert,
  buildMeetingUpdate,
  getInitialMeetingFormValues,
  type MeetingFormValues,
} from "@/lib/meetings/form";
import type { Meeting } from "@/types";

type MeetingFormProps = {
  mode: "create" | "edit";
  meeting?: Meeting;
};

export function MeetingForm({ mode, meeting }: MeetingFormProps) {
  const router = useRouter();
  const initialValues = useMemo(() => getInitialMeetingFormValues(meeting), [meeting]);
  const [values, setValues] = useState<MeetingFormValues>(initialValues);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField(name: keyof MeetingFormValues, value: string | boolean) {
    setValues((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      if (mode === "create") {
        const { data, error: createError } = await createMeeting(
          supabase,
          user.id,
          buildMeetingInsert(values),
        );

        if (createError) {
          setError(createError.message);
          return;
        }

        router.replace(`/meetings/${data.id}`);
        router.refresh();
        return;
      }

      if (!meeting) {
        setError("?섏젙???뚯쓽瑜?李얠쓣 ???놁뒿?덈떎.");
        return;
      }

      const { data, error: updateError } = await updateMeeting(
        supabase,
        user.id,
        meeting.id,
        buildMeetingUpdate(values),
      );

      if (updateError) {
        setError(updateError.message);
        return;
      }

      router.replace(`/meetings/${data.id}`);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            ?뚯쓽紐?            <input
              className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("title", event.target.value)}
              required
              value={values.title}
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-[#1F2F5C]">
              ?좎쭨
              <input
                className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
                onChange={(event) => updateField("meeting_date", event.target.value)}
                required
                type="date"
                value={values.meeting_date}
              />
            </label>
            <label className="block text-sm font-semibold text-[#1F2F5C]">
              留덇컧湲고븳
              <input
                className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
                onChange={(event) => updateField("due_date", event.target.value)}
                type="date"
                value={values.due_date}
              />
            </label>
          </div>
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            李몄꽍??            <input
              className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("attendees", event.target.value)}
              placeholder="?쇳몴濡?援щ텇"
              value={values.attendees}
            />
          </label>
        </div>
      </div>

      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            二쇱슂 ?쇱쓽 ?댁슜
            <textarea
              className="mt-1 min-h-28 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("discussion", event.target.value)}
              value={values.discussion}
            />
          </label>
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            寃곗젙?ы빆
            <textarea
              className="mt-1 min-h-24 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("decisions", event.target.value)}
              value={values.decisions}
            />
          </label>
          <label className="block text-sm font-semibold text-[#1F2F5C]">
            ?≪뀡?꾩씠??            <textarea
              className="mt-1 min-h-24 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
              onChange={(event) => updateField("action_items", event.target.value)}
              value={values.action_items}
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-[#1F2F5C]">
              ?쒓렇
              <input
                className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-base"
                onChange={(event) => updateField("tags", event.target.value)}
                placeholder="?쇳몴濡?援щ텇"
                value={values.tags}
              />
            </label>
            <label className="flex items-center gap-3 rounded-lg border border-[#E5E7EB] px-3 py-3 text-sm font-semibold text-[#1F2F5C] sm:mt-6">
              <input
                checked={values.reflected}
                className="h-5 w-5"
                onChange={(event) => updateField("reflected", event.target.checked)}
                type="checkbox"
              />
              ?낅Т??諛섏쁺 ?꾨즺
            </label>
          </div>
        </div>
      </div>

      {error ? <p className="text-sm text-[#C92735]">{error}</p> : null}

      <div className="form-actions grid grid-cols-2 gap-3">
        <button
          className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-bold text-[#1F2F5C]"
          onClick={() => router.back()}
          type="button"
        >취소</button>
        <button
          className="rounded-lg bg-[#1F2F5C] px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
          disabled={saving}
          type="submit"
        >
          {saving ? "저장 중" : mode === "create" ? "작성" : "수정"}
        </button>
      </div>
    </form>
  );
}
