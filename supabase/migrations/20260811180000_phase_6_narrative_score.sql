alter table public.profiles
  drop constraint if exists profiles_main_objective_check;

alter table public.profiles
  add constraint profiles_main_objective_check
  check (char_length(main_objective) between 8 and 240);

create table public.narrative_diagnostics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  version integer not null check (version > 0),
  status text not null default 'draft' check (status in ('draft', 'completed')),
  current_step smallint not null default 1 check (current_step between 1 and 3),
  professional_objective text check (
    professional_objective is null or char_length(professional_objective) between 8 and 240
  ),
  answers jsonb not null default '{}'::jsonb check (jsonb_typeof(answers) = 'object'),
  declared_consistency numeric(5,2) check (declared_consistency between 0 and 100),
  declared_coherence numeric(5,2) check (declared_coherence between 0 and 100),
  initial_score numeric(5,2) check (initial_score between 0 and 100),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, version),
  check (
    status = 'draft'
    or (
      professional_objective is not null
      and declared_consistency is not null
      and declared_coherence is not null
      and initial_score is not null
      and completed_at is not null
    )
  )
);

create unique index narrative_diagnostics_one_draft_idx
on public.narrative_diagnostics (user_id)
where status = 'draft';

create index narrative_diagnostics_user_completed_idx
on public.narrative_diagnostics (user_id, completed_at desc);

create table public.narrative_score_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  diagnostic_id uuid not null references public.narrative_diagnostics (id) on delete restrict,
  consistency_score numeric(5,2) not null check (consistency_score between 0 and 100),
  consistency_origin text not null check (consistency_origin in ('declared', 'observed')),
  coherence_score numeric(5,2) not null check (coherence_score between 0 and 100),
  coherence_origin text not null check (coherence_origin in ('declared', 'ai_assisted')),
  total_score numeric(5,2) not null check (total_score between 0 and 100),
  total_state text not null check (total_state in ('declared', 'partially_observed', 'observed')),
  period_start date,
  period_end date,
  method_version text not null,
  rubric_version text,
  explanation jsonb not null default '{}'::jsonb check (jsonb_typeof(explanation) = 'object'),
  evidence_ids uuid[] not null default '{}',
  reason text not null check (reason in ('diagnostic_completed', 'consistency_observed', 'coherence_updated', 'method_changed')),
  created_at timestamptz not null default now(),
  check (period_start is null or period_end is null or period_start <= period_end)
);

create index narrative_score_snapshots_user_created_idx
on public.narrative_score_snapshots (user_id, created_at desc);

alter table public.narrative_diagnostics enable row level security;
alter table public.narrative_score_snapshots enable row level security;

create policy "narrative_diagnostics_select_own"
on public.narrative_diagnostics for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "narrative_diagnostics_insert_own_draft"
on public.narrative_diagnostics for insert
to authenticated
with check ((select auth.uid()) = user_id and status = 'draft');

create policy "narrative_diagnostics_update_own_draft"
on public.narrative_diagnostics for update
to authenticated
using ((select auth.uid()) = user_id and status = 'draft')
with check ((select auth.uid()) = user_id and status = 'draft');

create policy "narrative_score_snapshots_select_own"
on public.narrative_score_snapshots for select
to authenticated
using ((select auth.uid()) = user_id);

grant select, insert, update on public.narrative_diagnostics to authenticated;
grant select on public.narrative_score_snapshots to authenticated;

create or replace function public.complete_narrative_diagnostic(
  p_diagnostic_id uuid,
  p_professional_objective text,
  p_answers jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_user_id uuid := auth.uid();
  answer_value integer;
  coherence_total integer := 0;
  consistency_total integer := 0;
  coherence_score numeric(5,2);
  consistency_score numeric(5,2);
  total_score numeric(5,2);
  answer_count integer;
  i integer;
begin
  if current_user_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  if char_length(trim(p_professional_objective)) not between 8 and 240
    or jsonb_typeof(p_answers) <> 'object' then
    raise exception 'invalid diagnostic data' using errcode = '22023';
  end if;

  select count(*) into answer_count from jsonb_object_keys(p_answers);
  if answer_count <> 10 then
    raise exception 'ten answers required' using errcode = '22023';
  end if;

  for i in 1..10 loop
    if not (p_answers ? ('q' || i)) or (p_answers ->> ('q' || i)) !~ '^(0|25|50|75|100)$' then
      raise exception 'invalid diagnostic answer' using errcode = '22023';
    end if;
    answer_value := (p_answers ->> ('q' || i))::integer;
    if i <= 6 then coherence_total := coherence_total + answer_value;
    elsif i <= 8 then consistency_total := consistency_total + answer_value;
    end if;
  end loop;

  perform 1 from public.narrative_diagnostics
  where id = p_diagnostic_id and user_id = current_user_id and status = 'draft'
  for update;
  if not found then
    raise exception 'diagnostic unavailable' using errcode = 'P0002';
  end if;

  coherence_score := round(coherence_total::numeric / 6);
  consistency_score := round(consistency_total::numeric / 2);
  total_score := round(coherence_score * 0.60 + consistency_score * 0.40);

  update public.narrative_diagnostics set
    status = 'completed',
    current_step = 3,
    professional_objective = trim(p_professional_objective),
    answers = p_answers,
    declared_consistency = consistency_score,
    declared_coherence = coherence_score,
    initial_score = total_score,
    completed_at = now(),
    updated_at = now()
  where id = p_diagnostic_id;

  update public.profiles set
    main_objective = trim(p_professional_objective),
    updated_at = now()
  where id = current_user_id;

  insert into public.narrative_score_snapshots (
    user_id, diagnostic_id, consistency_score, consistency_origin,
    coherence_score, coherence_origin, total_score, total_state,
    method_version, reason
  ) values (
    current_user_id, p_diagnostic_id, consistency_score, 'declared',
    coherence_score, 'declared', total_score, 'declared',
    'narrative-score-v1', 'diagnostic_completed'
  );

  return p_diagnostic_id;
end;
$$;

revoke all on function public.complete_narrative_diagnostic(uuid, text, jsonb) from public;
grant execute on function public.complete_narrative_diagnostic(uuid, text, jsonb) to authenticated;

create or replace function public.record_narrative_score_snapshot(
  p_diagnostic_id uuid,
  p_consistency_score numeric,
  p_consistency_origin text,
  p_coherence_score numeric,
  p_coherence_origin text,
  p_period_start date,
  p_period_end date,
  p_rubric_version text,
  p_explanation jsonb,
  p_evidence_ids uuid[],
  p_reason text
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_user_id uuid := auth.uid();
  new_snapshot_id uuid;
  computed_total numeric(5,2);
  computed_state text;
  invalid_evidence_count integer;
begin
  if current_user_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;
  if not exists (
    select 1 from public.narrative_diagnostics
    where id = p_diagnostic_id and user_id = current_user_id and status = 'completed'
  ) then
    raise exception 'diagnostic unavailable' using errcode = 'P0002';
  end if;
  if p_consistency_score not between 0 and 100
    or p_coherence_score not between 0 and 100
    or p_consistency_origin not in ('declared', 'observed')
    or p_coherence_origin not in ('declared', 'ai_assisted')
    or p_reason not in ('consistency_observed', 'coherence_updated', 'method_changed')
    or jsonb_typeof(coalesce(p_explanation, '{}'::jsonb)) <> 'object' then
    raise exception 'invalid score snapshot' using errcode = '22023';
  end if;

  select count(*) into invalid_evidence_count
  from unnest(coalesce(p_evidence_ids, '{}'::uuid[])) evidence_id
  where not exists (
    select 1 from public.evidences
    where id = evidence_id and user_id = current_user_id and status = 'confirmed'
  );
  if invalid_evidence_count > 0 then
    raise exception 'invalid evidence set' using errcode = '22023';
  end if;

  computed_total := round(p_coherence_score * 0.60 + p_consistency_score * 0.40);
  computed_state := case
    when p_consistency_origin = 'observed' and p_coherence_origin = 'ai_assisted' then 'observed'
    when p_consistency_origin = 'observed' or p_coherence_origin = 'ai_assisted' then 'partially_observed'
    else 'declared'
  end;

  insert into public.narrative_score_snapshots (
    user_id, diagnostic_id, consistency_score, consistency_origin,
    coherence_score, coherence_origin, total_score, total_state,
    period_start, period_end, method_version, rubric_version,
    explanation, evidence_ids, reason
  ) values (
    current_user_id, p_diagnostic_id, round(p_consistency_score), p_consistency_origin,
    round(p_coherence_score), p_coherence_origin, computed_total, computed_state,
    p_period_start, p_period_end, 'narrative-score-v1', p_rubric_version,
    coalesce(p_explanation, '{}'::jsonb), coalesce(p_evidence_ids, '{}'::uuid[]), p_reason
  ) returning id into new_snapshot_id;

  return new_snapshot_id;
end;
$$;

revoke all on function public.record_narrative_score_snapshot(uuid, numeric, text, numeric, text, date, date, text, jsonb, uuid[], text) from public;
grant execute on function public.record_narrative_score_snapshot(uuid, numeric, text, numeric, text, date, date, text, jsonb, uuid[], text) to authenticated;
