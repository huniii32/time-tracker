create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  name text,
  company_name text,
  role text,
  start_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  note_type text not null check (
    note_type in ('company', 'manager', 'dictionary', 'coworker', 'emotion', 'learning')
  ),
  title text not null,
  content text not null,
  entry_date date,
  tags text[] not null default '{}',
  fields jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  requester text,
  due_date date,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'pending' check (
    status in ('pending', 'in_progress', 'review_requested', 'revising', 'done')
  ),
  goal text,
  output text,
  feedback text,
  satisfaction integer check (satisfaction is null or satisfaction between 1 and 5),
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.meetings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  meeting_date date not null,
  attendees text[] not null default '{}',
  discussion text,
  decisions text,
  action_items text,
  due_date date,
  reflected boolean not null default false,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.time_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  start_time time not null,
  end_time time not null,
  category text not null check (
    category in (
      'company_work',
      'coding_study',
      'paper_review',
      'onboarding_log',
      'exercise',
      'rest',
      'commute',
      'sleep',
      'other'
    )
  ),
  activity text not null,
  focus_score integer check (focus_score is null or focus_score between 1 and 5),
  satisfaction integer check (satisfaction is null or satisfaction between 1 and 5),
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  goals text,
  achievement_rate integer check (achievement_rate is null or achievement_rate between 0 and 100),
  wasted_hours numeric,
  routine_satisfaction integer check (
    routine_satisfaction is null or routine_satisfaction between 1 and 5
  ),
  best text,
  regret text,
  learned text,
  next_week_action text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  goal_type text not null check (
    goal_type in (
      'onboarding',
      'work_performance',
      'coding_skill',
      'llm_understanding',
      'paper_review',
      'certification',
      'health',
      'other'
    )
  ),
  goal_level text not null check (goal_level in ('quarter', 'month', 'week', 'day')),
  period text,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  success_criteria text,
  linked_task_id uuid references public.tasks(id) on delete set null,
  linked_note_id uuid references public.notes(id) on delete set null,
  progress integer not null default 0 check (progress between 0 and 100),
  retrospective text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reflection_date date not null,
  learned text not null,
  difficult text,
  good text,
  tomorrow_action text,
  communication_lesson text,
  technical_lesson text,
  emotional_care text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_user_id_idx on public.profiles(user_id);
create index if not exists notes_user_date_idx on public.notes(user_id, entry_date desc);
create index if not exists tasks_user_due_idx on public.tasks(user_id, due_date asc);
create index if not exists meetings_user_date_idx on public.meetings(user_id, meeting_date desc);
create index if not exists time_logs_user_date_idx on public.time_logs(user_id, log_date desc);
create index if not exists weekly_reviews_user_week_idx on public.weekly_reviews(user_id, week_start desc);
create index if not exists goals_user_created_idx on public.goals(user_id, created_at desc);
create index if not exists reflections_user_date_idx on public.reflections(user_id, reflection_date desc);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles',
    'notes',
    'tasks',
    'meetings',
    'time_logs',
    'weekly_reviews',
    'goals',
    'reflections'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);

    execute format('drop trigger if exists set_%I_updated_at on public.%I', table_name, table_name);
    execute format(
      'create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      table_name,
      table_name
    );

    execute format('drop policy if exists "%I_select_own" on public.%I', table_name, table_name);
    execute format('drop policy if exists "%I_insert_own" on public.%I', table_name, table_name);
    execute format('drop policy if exists "%I_update_own" on public.%I', table_name, table_name);
    execute format('drop policy if exists "%I_delete_own" on public.%I', table_name, table_name);

    execute format(
      'create policy "%I_select_own" on public.%I for select using (auth.uid() = user_id)',
      table_name,
      table_name
    );
    execute format(
      'create policy "%I_insert_own" on public.%I for insert with check (auth.uid() = user_id)',
      table_name,
      table_name
    );
    execute format(
      'create policy "%I_update_own" on public.%I for update using (auth.uid() = user_id) with check (auth.uid() = user_id)',
      table_name,
      table_name
    );
    execute format(
      'create policy "%I_delete_own" on public.%I for delete using (auth.uid() = user_id)',
      table_name,
      table_name
    );
  end loop;
end $$;
