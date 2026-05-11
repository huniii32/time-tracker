import type { TableInsert, TableRow, TableUpdate } from "./database";

export type Profile = TableRow<"profiles">;
export type ProfileInsert = TableInsert<"profiles">;
export type ProfileUpdate = TableUpdate<"profiles">;

export type UserSettings = TableRow<"user_settings">;
export type UserSettingsInsert = TableInsert<"user_settings">;
export type UserSettingsUpdate = TableUpdate<"user_settings">;

export type Note = TableRow<"notes">;
export type NoteInsert = TableInsert<"notes">;
export type NoteUpdate = TableUpdate<"notes">;

export type Task = TableRow<"tasks">;
export type TaskInsert = TableInsert<"tasks">;
export type TaskUpdate = TableUpdate<"tasks">;

export type Meeting = TableRow<"meetings">;
export type MeetingInsert = TableInsert<"meetings">;
export type MeetingUpdate = TableUpdate<"meetings">;

export type TimeLog = TableRow<"time_logs">;
export type TimeLogInsert = TableInsert<"time_logs">;
export type TimeLogUpdate = TableUpdate<"time_logs">;

export type Routine = TableRow<"routines">;
export type RoutineInsert = TableInsert<"routines">;
export type RoutineUpdate = TableUpdate<"routines">;

export type RoutineCompletion = TableRow<"routine_completions">;
export type RoutineCompletionInsert = TableInsert<"routine_completions">;
export type RoutineCompletionUpdate = TableUpdate<"routine_completions">;

export type WeeklyReview = TableRow<"weekly_reviews">;
export type WeeklyReviewInsert = TableInsert<"weekly_reviews">;
export type WeeklyReviewUpdate = TableUpdate<"weekly_reviews">;

export type Goal = TableRow<"goals">;
export type GoalInsert = TableInsert<"goals">;
export type GoalUpdate = TableUpdate<"goals">;

export type Reflection = TableRow<"reflections">;
export type ReflectionInsert = TableInsert<"reflections">;
export type ReflectionUpdate = TableUpdate<"reflections">;
