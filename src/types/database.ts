export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type NoteType =
  | "company"
  | "manager"
  | "dictionary"
  | "coworker"
  | "emotion"
  | "learning";

export type TaskStatus = "pending" | "in_progress" | "review_requested" | "revising" | "done";
export type Priority = "low" | "medium" | "high";

export type TimeLogCategory =
  | "company_work"
  | "coding_study"
  | "paper_review"
  | "onboarding_log"
  | "exercise"
  | "rest"
  | "commute"
  | "sleep"
  | "other";

export type GoalType =
  | "onboarding"
  | "work_performance"
  | "coding_skill"
  | "llm_understanding"
  | "paper_review"
  | "certification"
  | "health"
  | "other";

export type GoalLevel = "quarter" | "month" | "week" | "day";
export type WeekStartDay =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";
export type DefaultStartPage = "home" | "notes" | "tasks" | "meetings" | "routines" | "reflections";

export type Tables = AppDatabase["public"]["Tables"];
export type TableName = keyof Tables;
export type TableRow<T extends TableName> = Tables[T]["Row"];
export type TableInsert<T extends TableName> = Tables[T]["Insert"];
export type TableUpdate<T extends TableName> = Tables[T]["Update"];

export type AppDatabase = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string | null;
          company_name: string | null;
          role: string | null;
          start_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name?: string | null;
          company_name?: string | null;
          role?: string | null;
          start_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string | null;
          company_name?: string | null;
          role?: string | null;
          start_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          display_name: string | null;
          joined_at: string | null;
          role: string | null;
          team: string | null;
          daily_target_hours: number;
          weekly_target_hours: number;
          week_starts_on: WeekStartDay;
          default_start_page: DefaultStartPage;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          display_name?: string | null;
          joined_at?: string | null;
          role?: string | null;
          team?: string | null;
          daily_target_hours?: number;
          weekly_target_hours?: number;
          week_starts_on?: WeekStartDay;
          default_start_page?: DefaultStartPage;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          display_name?: string | null;
          joined_at?: string | null;
          role?: string | null;
          team?: string | null;
          daily_target_hours?: number;
          weekly_target_hours?: number;
          week_starts_on?: WeekStartDay;
          default_start_page?: DefaultStartPage;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          note_type: NoteType;
          title: string;
          content: string;
          entry_date: string | null;
          tags: string[];
          fields: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          note_type: NoteType;
          title: string;
          content: string;
          entry_date?: string | null;
          tags?: string[];
          fields?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          note_type?: NoteType;
          title?: string;
          content?: string;
          entry_date?: string | null;
          tags?: string[];
          fields?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          requester: string | null;
          due_date: string | null;
          priority: Priority;
          status: TaskStatus;
          goal: string | null;
          output: string | null;
          feedback: string | null;
          satisfaction: number | null;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          requester?: string | null;
          due_date?: string | null;
          priority?: Priority;
          status?: TaskStatus;
          goal?: string | null;
          output?: string | null;
          feedback?: string | null;
          satisfaction?: number | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          requester?: string | null;
          due_date?: string | null;
          priority?: Priority;
          status?: TaskStatus;
          goal?: string | null;
          output?: string | null;
          feedback?: string | null;
          satisfaction?: number | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      meetings: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          meeting_date: string;
          attendees: string[];
          discussion: string | null;
          decisions: string | null;
          action_items: string | null;
          due_date: string | null;
          reflected: boolean;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          meeting_date: string;
          attendees?: string[];
          discussion?: string | null;
          decisions?: string | null;
          action_items?: string | null;
          due_date?: string | null;
          reflected?: boolean;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          meeting_date?: string;
          attendees?: string[];
          discussion?: string | null;
          decisions?: string | null;
          action_items?: string | null;
          due_date?: string | null;
          reflected?: boolean;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      time_logs: {
        Row: {
          id: string;
          user_id: string;
          log_date: string;
          start_time: string;
          end_time: string;
          category: TimeLogCategory;
          activity: string;
          focus_score: number | null;
          satisfaction: number | null;
          memo: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          log_date: string;
          start_time: string;
          end_time: string;
          category: TimeLogCategory;
          activity: string;
          focus_score?: number | null;
          satisfaction?: number | null;
          memo?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          log_date?: string;
          start_time?: string;
          end_time?: string;
          category?: TimeLogCategory;
          activity?: string;
          focus_score?: number | null;
          satisfaction?: number | null;
          memo?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      weekly_reviews: {
        Row: {
          id: string;
          user_id: string;
          week_start: string;
          goals: string | null;
          achievement_rate: number | null;
          wasted_hours: number | null;
          routine_satisfaction: number | null;
          best: string | null;
          regret: string | null;
          learned: string | null;
          next_week_action: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          week_start: string;
          goals?: string | null;
          achievement_rate?: number | null;
          wasted_hours?: number | null;
          routine_satisfaction?: number | null;
          best?: string | null;
          regret?: string | null;
          learned?: string | null;
          next_week_action?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          week_start?: string;
          goals?: string | null;
          achievement_rate?: number | null;
          wasted_hours?: number | null;
          routine_satisfaction?: number | null;
          best?: string | null;
          regret?: string | null;
          learned?: string | null;
          next_week_action?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          goal_type: GoalType;
          goal_level: GoalLevel;
          period: string | null;
          priority: Priority;
          success_criteria: string | null;
          linked_task_id: string | null;
          linked_note_id: string | null;
          progress: number;
          retrospective: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          goal_type: GoalType;
          goal_level: GoalLevel;
          period?: string | null;
          priority?: Priority;
          success_criteria?: string | null;
          linked_task_id?: string | null;
          linked_note_id?: string | null;
          progress?: number;
          retrospective?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          goal_type?: GoalType;
          goal_level?: GoalLevel;
          period?: string | null;
          priority?: Priority;
          success_criteria?: string | null;
          linked_task_id?: string | null;
          linked_note_id?: string | null;
          progress?: number;
          retrospective?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      reflections: {
        Row: {
          id: string;
          user_id: string;
          reflection_date: string;
          learned: string;
          difficult: string | null;
          good: string | null;
          tomorrow_action: string | null;
          communication_lesson: string | null;
          technical_lesson: string | null;
          emotional_care: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          reflection_date: string;
          learned: string;
          difficult?: string | null;
          good?: string | null;
          tomorrow_action?: string | null;
          communication_lesson?: string | null;
          technical_lesson?: string | null;
          emotional_care?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          reflection_date?: string;
          learned?: string;
          difficult?: string | null;
          good?: string | null;
          tomorrow_action?: string | null;
          communication_lesson?: string | null;
          technical_lesson?: string | null;
          emotional_care?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
