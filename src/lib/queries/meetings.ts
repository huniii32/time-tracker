import type { MeetingInsert, MeetingUpdate } from "@/types";
import type { AppSupabaseClient } from "./client";
import { withUpdatedAt } from "./client";

export async function listMeetings(client: AppSupabaseClient, userId: string) {
  return client
    .from("meetings")
    .select("*")
    .eq("user_id", userId)
    .order("meeting_date", { ascending: false });
}

export async function listUnreflectedMeetings(client: AppSupabaseClient, userId: string) {
  return client.from("meetings").select("*").eq("user_id", userId).eq("reflected", false);
}

export async function getMeeting(client: AppSupabaseClient, userId: string, meetingId: string) {
  return client.from("meetings").select("*").eq("user_id", userId).eq("id", meetingId).single();
}

export async function createMeeting(
  client: AppSupabaseClient,
  userId: string,
  payload: Omit<MeetingInsert, "user_id">,
) {
  return client
    .from("meetings")
    .insert({ ...payload, user_id: userId })
    .select("*")
    .single();
}

export async function updateMeeting(
  client: AppSupabaseClient,
  userId: string,
  meetingId: string,
  payload: MeetingUpdate,
) {
  return client
    .from("meetings")
    .update(withUpdatedAt(payload))
    .eq("user_id", userId)
    .eq("id", meetingId)
    .select("*")
    .single();
}

export async function deleteMeeting(
  client: AppSupabaseClient,
  userId: string,
  meetingId: string,
) {
  return client.from("meetings").delete().eq("user_id", userId).eq("id", meetingId);
}
