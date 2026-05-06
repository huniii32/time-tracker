import type { Meeting, MeetingInsert, MeetingUpdate } from "@/types";

export type MeetingFormValues = {
  title: string;
  meeting_date: string;
  attendees: string;
  discussion: string;
  decisions: string;
  action_items: string;
  due_date: string;
  reflected: boolean;
  tags: string;
};

export function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

export function parseList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function stringifyList(items: string[]) {
  return items.join(", ");
}

export function getInitialMeetingFormValues(meeting?: Meeting): MeetingFormValues {
  return {
    title: meeting?.title ?? "",
    meeting_date: meeting?.meeting_date ?? getTodayDate(),
    attendees: meeting ? stringifyList(meeting.attendees) : "",
    discussion: meeting?.discussion ?? "",
    decisions: meeting?.decisions ?? "",
    action_items: meeting?.action_items ?? "",
    due_date: meeting?.due_date ?? "",
    reflected: meeting?.reflected ?? false,
    tags: meeting ? stringifyList(meeting.tags) : "",
  };
}

export function buildMeetingInsert(
  values: MeetingFormValues,
): Omit<MeetingInsert, "user_id"> {
  return {
    title: values.title.trim(),
    meeting_date: values.meeting_date,
    attendees: parseList(values.attendees),
    discussion: values.discussion.trim() || null,
    decisions: values.decisions.trim() || null,
    action_items: values.action_items.trim() || null,
    due_date: values.due_date || null,
    reflected: values.reflected,
    tags: parseList(values.tags),
  };
}

export function buildMeetingUpdate(values: MeetingFormValues): MeetingUpdate {
  return buildMeetingInsert(values);
}
