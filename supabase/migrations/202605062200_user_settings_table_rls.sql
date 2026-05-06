create table if not exists public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text,
  joined_at date,
  role text,
  team text,
  daily_target_hours numeric not null default 8,
  weekly_target_hours numeric not null default 40,
  week_starts_on text not null default 'monday' check (
    week_starts_on in (
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday'
    )
  ),
  default_start_page text not null default 'home' check (
    default_start_page in ('home', 'notes', 'tasks', 'meetings', 'routines', 'reflections')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create index if not exists user_settings_user_id_idx on public.user_settings(user_id);

alter table public.user_settings enable row level security;

drop trigger if exists set_user_settings_updated_at on public.user_settings;
create trigger set_user_settings_updated_at
before update on public.user_settings
for each row
execute function public.set_updated_at();

drop policy if exists "Users can view own settings" on public.user_settings;
drop policy if exists "Users can insert own settings" on public.user_settings;
drop policy if exists "Users can update own settings" on public.user_settings;
drop policy if exists "Users can delete own settings" on public.user_settings;

create policy "Users can view own settings"
on public.user_settings for select
using (auth.uid() = user_id);

create policy "Users can insert own settings"
on public.user_settings for insert
with check (auth.uid() = user_id);

create policy "Users can update own settings"
on public.user_settings for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own settings"
on public.user_settings for delete
using (auth.uid() = user_id);
