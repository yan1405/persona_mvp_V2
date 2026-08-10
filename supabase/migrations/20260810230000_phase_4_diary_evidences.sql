alter table public.daily_logs
  add column occurred_on date,
  add column context text check (context is null or char_length(context) between 2 and 160);

update public.daily_logs
set occurred_on = (created_at at time zone 'America/Sao_Paulo')::date
where occurred_on is null;

alter table public.daily_logs
  alter column occurred_on set default current_date,
  alter column occurred_on set not null;

create index daily_logs_user_occurred_on_idx
on public.daily_logs (user_id, occurred_on desc, created_at desc);

create table public.evidence_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  daily_log_id uuid not null references public.daily_logs (id) on delete cascade,
  origin text not null check (origin in ('ai', 'manual')),
  status text not null check (
    status in ('generating', 'for_review', 'confirmed', 'rejected', 'failed', 'no_suggestion')
  ),
  title text check (title is null or char_length(title) between 4 and 100),
  context text check (context is null or char_length(context) <= 600),
  challenge text check (challenge is null or char_length(challenge) <= 600),
  action text check (action is null or char_length(action) <= 800),
  result text check (result is null or char_length(result) <= 600),
  competencies text[] not null default '{}',
  learning text check (learning is null or char_length(learning) <= 600),
  unsupported_fields text[] not null default '{}',
  error_code text,
  generated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (cardinality(competencies) <= 8),
  check (
    unsupported_fields <@ array['context', 'challenge', 'action', 'result', 'competencies', 'learning']::text[]
  )
);

create unique index evidence_suggestions_one_generating_idx
on public.evidence_suggestions (daily_log_id)
where status = 'generating';

create index evidence_suggestions_user_log_idx
on public.evidence_suggestions (user_id, daily_log_id, created_at desc);

create table public.evidences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  source_log_id uuid not null references public.daily_logs (id) on delete restrict,
  suggestion_id uuid unique references public.evidence_suggestions (id) on delete set null,
  title text not null check (char_length(title) between 4 and 100),
  context text not null check (char_length(context) between 4 and 600),
  challenge text check (challenge is null or char_length(challenge) <= 600),
  action text not null check (char_length(action) between 4 and 800),
  result text check (result is null or char_length(result) <= 600),
  competencies text[] not null default '{}',
  learning text check (learning is null or char_length(learning) <= 600),
  status text not null default 'confirmed' check (status in ('confirmed', 'archived')),
  confirmed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (cardinality(competencies) between 1 and 8)
);

create index evidences_user_created_at_idx
on public.evidences (user_id, created_at desc);

alter table public.evidence_suggestions enable row level security;
alter table public.evidences enable row level security;

create policy "evidence_suggestions_select_own"
on public.evidence_suggestions for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "evidence_suggestions_insert_own"
on public.evidence_suggestions for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and status in ('generating', 'for_review', 'failed', 'no_suggestion')
);

create policy "evidence_suggestions_update_own_unconfirmed"
on public.evidence_suggestions for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id and status <> 'confirmed');

create policy "evidences_select_own"
on public.evidences for select
to authenticated
using ((select auth.uid()) = user_id);

grant select, insert, update on public.evidence_suggestions to authenticated;
grant select on public.evidences to authenticated;

create or replace function public.confirm_evidence_suggestion(p_suggestion_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_user_id uuid := auth.uid();
  suggestion public.evidence_suggestions%rowtype;
  evidence_id uuid;
begin
  if current_user_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  select * into suggestion
  from public.evidence_suggestions
  where id = p_suggestion_id
    and user_id = current_user_id
    and status = 'for_review'
  for update;

  if not found then
    raise exception 'suggestion unavailable' using errcode = 'P0002';
  end if;

  if char_length(coalesce(trim(suggestion.title), '')) not between 4 and 100
    or char_length(coalesce(trim(suggestion.context), '')) not between 4 and 600
    or char_length(coalesce(trim(suggestion.action), '')) not between 4 and 800
    or cardinality(suggestion.competencies) not between 1 and 8 then
    raise exception 'suggestion requires review' using errcode = '22023';
  end if;

  insert into public.evidences (
    user_id,
    source_log_id,
    suggestion_id,
    title,
    context,
    challenge,
    action,
    result,
    competencies,
    learning
  )
  values (
    current_user_id,
    suggestion.daily_log_id,
    suggestion.id,
    trim(suggestion.title),
    trim(suggestion.context),
    nullif(trim(suggestion.challenge), ''),
    trim(suggestion.action),
    nullif(trim(suggestion.result), ''),
    suggestion.competencies,
    nullif(trim(suggestion.learning), '')
  )
  returning id into evidence_id;

  update public.evidence_suggestions
  set status = 'confirmed', updated_at = now()
  where id = suggestion.id;

  update public.daily_logs
  set status = 'structured', updated_at = now()
  where id = suggestion.daily_log_id and user_id = current_user_id;

  return evidence_id;
end;
$$;

revoke all on function public.confirm_evidence_suggestion(uuid) from public;
grant execute on function public.confirm_evidence_suggestion(uuid) to authenticated;
