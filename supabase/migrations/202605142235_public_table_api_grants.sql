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
    'reflections',
    'user_settings',
    'routines',
    'routine_completions'
  ]
  loop
    execute format('revoke all on table public.%I from anon', table_name);
    execute format(
      'grant select, insert, update, delete on table public.%I to authenticated',
      table_name
    );
    execute format(
      'grant select, insert, update, delete on table public.%I to service_role',
      table_name
    );
  end loop;
end $$;
