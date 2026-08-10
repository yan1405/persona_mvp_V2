create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 80),
  professional_moment text not null check (
    professional_moment in (
      'estudando',
      'inicio-carreira',
      'transicao',
      'consolidacao',
      'lideranca'
    )
  ),
  main_objective text not null check (char_length(main_objective) between 8 and 180),
  product_consent boolean not null default false check (product_consent),
  product_consent_at timestamptz not null,
  consent_version text not null,
  communications_consent boolean not null default false,
  daily_log_reminder_enabled boolean not null default false,
  daily_log_reminder_time time,
  onboarding_completed_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (daily_log_reminder_enabled or daily_log_reminder_time is null)
);

create table if not exists public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  entry_key text not null,
  content text not null check (char_length(content) between 40 and 2000),
  source text not null default 'text' check (source in ('text', 'voice')),
  status text not null default 'raw' check (status in ('raw', 'structured', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, entry_key)
);

alter table public.profiles enable row level security;
alter table public.daily_logs enable row level security;

create policy "profiles_select_own"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "daily_logs_select_own"
on public.daily_logs for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "daily_logs_insert_own"
on public.daily_logs for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "daily_logs_update_own"
on public.daily_logs for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "daily_logs_delete_own"
on public.daily_logs for delete
to authenticated
using ((select auth.uid()) = user_id);

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.daily_logs to authenticated;

create or replace function public.complete_onboarding(
  p_display_name text,
  p_professional_moment text,
  p_main_objective text,
  p_product_consent boolean,
  p_communications_consent boolean,
  p_reminder_enabled boolean,
  p_reminder_time time,
  p_daily_log_content text
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  first_log_id uuid;
begin
  if current_user_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  if not p_product_consent then
    raise exception 'product consent required' using errcode = '22023';
  end if;

  if char_length(trim(p_display_name)) not between 2 and 80
    or p_professional_moment not in ('estudando', 'inicio-carreira', 'transicao', 'consolidacao', 'lideranca')
    or char_length(trim(p_main_objective)) not between 8 and 180
    or char_length(trim(p_daily_log_content)) not between 40 and 2000 then
    raise exception 'invalid onboarding data' using errcode = '22023';
  end if;

  insert into public.profiles (
    id,
    display_name,
    professional_moment,
    main_objective,
    product_consent,
    product_consent_at,
    consent_version,
    communications_consent,
    daily_log_reminder_enabled,
    daily_log_reminder_time,
    onboarding_completed_at,
    updated_at
  )
  values (
    current_user_id,
    trim(p_display_name),
    p_professional_moment,
    trim(p_main_objective),
    true,
    now(),
    '2026-08-10',
    p_communications_consent,
    p_reminder_enabled,
    case when p_reminder_enabled then p_reminder_time else null end,
    now(),
    now()
  )
  on conflict (id) do update set
    display_name = excluded.display_name,
    professional_moment = excluded.professional_moment,
    main_objective = excluded.main_objective,
    product_consent = excluded.product_consent,
    product_consent_at = excluded.product_consent_at,
    consent_version = excluded.consent_version,
    communications_consent = excluded.communications_consent,
    daily_log_reminder_enabled = excluded.daily_log_reminder_enabled,
    daily_log_reminder_time = excluded.daily_log_reminder_time,
    onboarding_completed_at = excluded.onboarding_completed_at,
    updated_at = excluded.updated_at;

  insert into public.daily_logs (user_id, entry_key, content)
  values (current_user_id, 'onboarding-first', trim(p_daily_log_content))
  on conflict (user_id, entry_key) do update set
    content = excluded.content,
    updated_at = now()
  returning id into first_log_id;

  return first_log_id;
end;
$$;

revoke all on function public.complete_onboarding(text, text, text, boolean, boolean, boolean, time, text) from public;
grant execute on function public.complete_onboarding(text, text, text, boolean, boolean, boolean, time, text) to authenticated;
