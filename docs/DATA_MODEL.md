# Data Model

Milestone 2 prepares Supabase PostgreSQL tables, RLS, TypeScript types, and query layer boundaries. UI CRUD is intentionally excluded from this milestone.

## Tables

- `profiles`
- `notes`
- `tasks`
- `meetings`
- `time_logs`
- `weekly_reviews`
- `goals`
- `reflections`

## Required Columns

Every table includes:

- `id`
- `user_id`
- `created_at`
- `updated_at`

`user_id` references `auth.users(id)` and is the primary data ownership boundary.

## RLS Principle

Every table enables Row Level Security and uses the same ownership policies:

- select: `auth.uid() = user_id`
- insert: `auth.uid() = user_id`
- update: `auth.uid() = user_id`
- delete: `auth.uid() = user_id`

The migration file is:

`supabase/migrations/202605050426_milestone_2_data_model.sql`

## Query Layer Principle

Components should not call Supabase table queries directly. Feature code should use files under `src/lib/queries`.

Query functions accept `userId` and apply `.eq("user_id", userId)` for user-scoped access. RLS remains the final enforcement layer in Supabase.
