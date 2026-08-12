create table public.live_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  target_role text not null check (char_length(target_role) between 4 and 120),
  company text not null check (char_length(company) between 2 and 120),
  opportunity_description text check (opportunity_description is null or char_length(opportunity_description) <= 2000),
  status text not null default 'preparing' check (status in ('preparing', 'active', 'paused', 'closed')),
  started_at timestamptz,
  paused_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index live_sessions_user_updated_idx on public.live_sessions (user_id, updated_at desc);

create table public.live_session_evidences (
  session_id uuid not null references public.live_sessions (id) on delete cascade,
  evidence_id uuid not null references public.evidences (id) on delete restrict,
  user_id uuid not null references auth.users (id) on delete cascade,
  recommendation_score integer not null default 0 check (recommendation_score >= 0),
  recommendation_reasons text[] not null default '{}',
  authorized_at timestamptz not null default now(),
  removed_at timestamptz,
  primary key (session_id, evidence_id)
);

create index live_session_evidences_user_idx on public.live_session_evidences (user_id, session_id);

create table public.live_questions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.live_sessions (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  question_text text not null check (char_length(question_text) between 8 and 500),
  intent text check (intent is null or intent in ('objective', 'behavioral', 'complex')),
  status text not null default 'processing' check (status in ('processing', 'answered', 'gap', 'failed')),
  primary_evidence_id uuid references public.evidences (id) on delete restrict,
  error_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index live_questions_session_created_idx on public.live_questions (session_id, created_at);

create table public.live_draft_versions (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.live_questions (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  version integer not null check (version > 0),
  mode text not null check (mode in ('initial', 'shorter', 'deeper', 'alternative')),
  target_duration_seconds integer not null check (target_duration_seconds between 10 and 60),
  draft_text text,
  arguments jsonb not null default '[]'::jsonb check (jsonb_typeof(arguments) = 'array'),
  evidence_ids uuid[] not null default '{}',
  gap jsonb check (gap is null or jsonb_typeof(gap) = 'object'),
  model text not null,
  prompt_version text not null,
  created_at timestamptz not null default now(),
  unique (question_id, version),
  check ((draft_text is not null and gap is null) or (draft_text is null and gap is not null))
);

create index live_draft_versions_question_idx on public.live_draft_versions (question_id, version);

alter table public.live_sessions enable row level security;
alter table public.live_session_evidences enable row level security;
alter table public.live_questions enable row level security;
alter table public.live_draft_versions enable row level security;

create policy "live_sessions_select_own" on public.live_sessions for select to authenticated
using ((select auth.uid()) = user_id);
create policy "live_sessions_insert_own" on public.live_sessions for insert to authenticated
with check ((select auth.uid()) = user_id and status = 'preparing');

create policy "live_session_evidences_select_own" on public.live_session_evidences for select to authenticated
using ((select auth.uid()) = user_id);
create policy "live_questions_select_own" on public.live_questions for select to authenticated
using ((select auth.uid()) = user_id);
create policy "live_draft_versions_select_own" on public.live_draft_versions for select to authenticated
using ((select auth.uid()) = user_id);

grant select, insert on public.live_sessions to authenticated;
grant select on public.live_session_evidences, public.live_questions, public.live_draft_versions to authenticated;

create or replace function public.set_live_evidences(
  p_session_id uuid,
  p_evidences jsonb
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_user_id uuid := auth.uid();
  session_status text;
  evidence_count integer;
  invalid_count integer;
begin
  if current_user_id is null then raise exception 'authentication required' using errcode = '42501'; end if;
  if jsonb_typeof(p_evidences) <> 'array' then raise exception 'invalid evidence set' using errcode = '22023'; end if;

  select status into session_status from public.live_sessions
  where id = p_session_id and user_id = current_user_id for update;
  if session_status is null then raise exception 'session unavailable' using errcode = 'P0002'; end if;
  if session_status not in ('preparing', 'paused') then raise exception 'session not editable' using errcode = '55000'; end if;

  select count(*), count(*) filter (where e.id is null)
  into evidence_count, invalid_count
  from jsonb_to_recordset(p_evidences) as item(id uuid, score integer, reasons text[])
  left join public.evidences e on e.id = item.id and e.user_id = current_user_id and e.status = 'confirmed';
  if evidence_count not between 1 and 8 or invalid_count > 0 then
    raise exception 'invalid evidence set' using errcode = '22023';
  end if;

  update public.live_session_evidences set removed_at = now()
  where session_id = p_session_id and user_id = current_user_id and removed_at is null;

  insert into public.live_session_evidences (
    session_id, evidence_id, user_id, recommendation_score, recommendation_reasons, authorized_at, removed_at
  )
  select p_session_id, item.id, current_user_id, greatest(coalesce(item.score, 0), 0), coalesce(item.reasons, '{}'), now(), null
  from jsonb_to_recordset(p_evidences) as item(id uuid, score integer, reasons text[])
  on conflict (session_id, evidence_id) do update set
    recommendation_score = excluded.recommendation_score,
    recommendation_reasons = excluded.recommendation_reasons,
    authorized_at = now(),
    removed_at = null;

  update public.live_sessions set updated_at = now() where id = p_session_id;
end;
$$;

create or replace function public.change_live_session_status(p_session_id uuid, p_next_status text)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_user_id uuid := auth.uid();
  current_status text;
  evidence_count integer;
begin
  if current_user_id is null then raise exception 'authentication required' using errcode = '42501'; end if;
  select status into current_status from public.live_sessions
  where id = p_session_id and user_id = current_user_id for update;
  if current_status is null then raise exception 'session unavailable' using errcode = 'P0002'; end if;
  if p_next_status = 'active' then
    if current_status not in ('preparing', 'paused') then raise exception 'invalid transition' using errcode = '55000'; end if;
    select count(*) into evidence_count from public.live_session_evidences
    where session_id = p_session_id and user_id = current_user_id and removed_at is null;
    if evidence_count not between 1 and 8 then raise exception 'one to eight evidences required' using errcode = '22023'; end if;
  elsif p_next_status = 'paused' then
    if current_status <> 'active' then raise exception 'invalid transition' using errcode = '55000'; end if;
  elsif p_next_status = 'closed' then
    if current_status not in ('active', 'paused') then raise exception 'invalid transition' using errcode = '55000'; end if;
  elsif p_next_status not in ('active', 'paused', 'closed') then
    raise exception 'invalid transition' using errcode = '22023';
  end if;

  update public.live_sessions set
    status = p_next_status,
    started_at = case when p_next_status = 'active' then coalesce(started_at, now()) else started_at end,
    paused_at = case when p_next_status = 'paused' then now() when p_next_status = 'active' then null else paused_at end,
    closed_at = case when p_next_status = 'closed' then now() else closed_at end,
    updated_at = now()
  where id = p_session_id;
end;
$$;

create or replace function public.create_live_question(p_session_id uuid, p_question_text text)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare current_user_id uuid := auth.uid(); new_id uuid;
begin
  if current_user_id is null then raise exception 'authentication required' using errcode = '42501'; end if;
  if char_length(trim(p_question_text)) not between 8 and 500 then raise exception 'invalid question' using errcode = '22023'; end if;
  if not exists (select 1 from public.live_sessions where id = p_session_id and user_id = current_user_id and status = 'active') then
    raise exception 'session not active' using errcode = '55000';
  end if;
  insert into public.live_questions (session_id, user_id, question_text)
  values (p_session_id, current_user_id, trim(p_question_text)) returning id into new_id;
  return new_id;
end;
$$;

create or replace function public.finish_live_question(
  p_question_id uuid,
  p_intent text,
  p_status text,
  p_primary_evidence_id uuid,
  p_mode text,
  p_target_duration_seconds integer,
  p_draft_text text,
  p_arguments jsonb,
  p_evidence_ids uuid[],
  p_gap jsonb,
  p_model text,
  p_prompt_version text
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare current_user_id uuid := auth.uid(); new_id uuid; next_version integer; session_id_value uuid; invalid_count integer;
begin
  if current_user_id is null then raise exception 'authentication required' using errcode = '42501'; end if;
  select session_id into session_id_value from public.live_questions
  where id = p_question_id and user_id = current_user_id and status in ('processing', 'answered', 'gap', 'failed') for update;
  if session_id_value is null then raise exception 'question unavailable' using errcode = 'P0002'; end if;
  if not exists (select 1 from public.live_sessions where id = session_id_value and user_id = current_user_id and status = 'active') then
    raise exception 'session not active' using errcode = '55000';
  end if;
  if p_intent not in ('objective', 'behavioral', 'complex') or p_status not in ('answered', 'gap')
    or p_mode not in ('initial', 'shorter', 'deeper', 'alternative')
    or p_target_duration_seconds not between 10 and 60 or jsonb_typeof(p_arguments) <> 'array'
    or ((p_draft_text is null) = (p_gap is null)) then raise exception 'invalid response' using errcode = '22023'; end if;
  select count(*) into invalid_count from unnest(coalesce(p_evidence_ids, '{}')) evidence_id
  where not exists (select 1 from public.live_session_evidences where session_id = session_id_value and user_id = current_user_id and live_session_evidences.evidence_id = evidence_id and removed_at is null);
  if invalid_count > 0 or (p_primary_evidence_id is not null and not (p_primary_evidence_id = any(coalesce(p_evidence_ids, '{}')))) then
    raise exception 'unauthorized evidence' using errcode = '22023';
  end if;
  select coalesce(max(version), 0) + 1 into next_version from public.live_draft_versions where question_id = p_question_id;
  insert into public.live_draft_versions (question_id, user_id, version, mode, target_duration_seconds, draft_text, arguments, evidence_ids, gap, model, prompt_version)
  values (p_question_id, current_user_id, next_version, p_mode, p_target_duration_seconds, p_draft_text, p_arguments, coalesce(p_evidence_ids, '{}'), p_gap, p_model, p_prompt_version)
  returning id into new_id;
  update public.live_questions set intent = p_intent, status = p_status, primary_evidence_id = p_primary_evidence_id, error_code = null, updated_at = now() where id = p_question_id;
  update public.live_sessions set updated_at = now() where id = session_id_value;
  return new_id;
end;
$$;

create or replace function public.fail_live_question(p_question_id uuid, p_error_code text)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
begin
  update public.live_questions set status = 'failed', error_code = left(p_error_code, 80), updated_at = now()
  where id = p_question_id and user_id = auth.uid() and status = 'processing';
  if not found then raise exception 'question unavailable' using errcode = 'P0002'; end if;
end;
$$;

create or replace function public.duplicate_live_session(p_session_id uuid)
returns uuid language plpgsql security definer set search_path = public, pg_temp as $$
declare current_user_id uuid := auth.uid(); new_id uuid;
begin
  insert into public.live_sessions (user_id, target_role, company, opportunity_description)
  select current_user_id, target_role, company, opportunity_description from public.live_sessions
  where id = p_session_id and user_id = current_user_id and status = 'closed'
  returning id into new_id;
  if new_id is null then raise exception 'closed session unavailable' using errcode = 'P0002'; end if;
  insert into public.live_session_evidences (session_id, evidence_id, user_id, recommendation_score, recommendation_reasons)
  select new_id, lse.evidence_id, current_user_id, lse.recommendation_score, lse.recommendation_reasons
  from public.live_session_evidences lse join public.evidences e on e.id = lse.evidence_id
  where lse.session_id = p_session_id and lse.user_id = current_user_id and lse.removed_at is null and e.status = 'confirmed';
  return new_id;
end;
$$;

revoke all on function public.set_live_evidences(uuid, jsonb) from public;
revoke all on function public.change_live_session_status(uuid, text) from public;
revoke all on function public.create_live_question(uuid, text) from public;
revoke all on function public.finish_live_question(uuid, text, text, uuid, text, integer, text, jsonb, uuid[], jsonb, text, text) from public;
revoke all on function public.fail_live_question(uuid, text) from public;
revoke all on function public.duplicate_live_session(uuid) from public;
grant execute on function public.set_live_evidences(uuid, jsonb) to authenticated;
grant execute on function public.change_live_session_status(uuid, text) to authenticated;
grant execute on function public.create_live_question(uuid, text) to authenticated;
grant execute on function public.finish_live_question(uuid, text, text, uuid, text, integer, text, jsonb, uuid[], jsonb, text, text) to authenticated;
grant execute on function public.fail_live_question(uuid, text) to authenticated;
grant execute on function public.duplicate_live_session(uuid) to authenticated;
