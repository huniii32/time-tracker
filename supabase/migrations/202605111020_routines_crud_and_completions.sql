create table if not exists public.routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (length(btrim(title)) > 0),
  description text,
  category text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.routine_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  routine_id uuid not null references public.routines(id) on delete cascade,
  completion_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, routine_id, completion_date)
);

create index if not exists routines_user_active_sort_idx
  on public.routines(user_id, is_active, sort_order asc, created_at asc);

create index if not exists routine_completions_user_date_idx
  on public.routine_completions(user_id, completion_date desc);

create index if not exists routine_completions_routine_date_idx
  on public.routine_completions(routine_id, completion_date desc);

alter table public.routines enable row level security;
alter table public.routine_completions enable row level security;

drop trigger if exists set_routines_updated_at on public.routines;
create trigger set_routines_updated_at
  before update on public.routines
  for each row execute function public.set_updated_at();

drop trigger if exists set_routine_completions_updated_at on public.routine_completions;
create trigger set_routine_completions_updated_at
  before update on public.routine_completions
  for each row execute function public.set_updated_at();

drop policy if exists "routines_select_own" on public.routines;
drop policy if exists "routines_insert_own" on public.routines;
drop policy if exists "routines_update_own" on public.routines;
drop policy if exists "routines_delete_own" on public.routines;

create policy "routines_select_own"
  on public.routines for select
  using (auth.uid() = user_id);

create policy "routines_insert_own"
  on public.routines for insert
  with check (auth.uid() = user_id);

create policy "routines_update_own"
  on public.routines for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "routines_delete_own"
  on public.routines for delete
  using (auth.uid() = user_id);

drop policy if exists "routine_completions_select_own" on public.routine_completions;
drop policy if exists "routine_completions_insert_own" on public.routine_completions;
drop policy if exists "routine_completions_update_own" on public.routine_completions;
drop policy if exists "routine_completions_delete_own" on public.routine_completions;

create policy "routine_completions_select_own"
  on public.routine_completions for select
  using (auth.uid() = user_id);

create policy "routine_completions_insert_own"
  on public.routine_completions for insert
  with check (auth.uid() = user_id);

create policy "routine_completions_update_own"
  on public.routine_completions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "routine_completions_delete_own"
  on public.routine_completions for delete
  using (auth.uid() = user_id);
