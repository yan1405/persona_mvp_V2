create table public.artifacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('star', 'pitch', 'resume', 'portfolio')),
  title text not null check (char_length(title) between 2 and 120),
  objective text not null check (char_length(objective) between 2 and 240),
  opportunity_context text check (opportunity_context is null or char_length(opportunity_context) <= 2000),
  status text not null default 'draft' check (status in ('draft', 'reviewed')),
  revision integer not null default 1 check (revision > 0),
  working_content jsonb not null default '{"blocks":[]}'::jsonb
    check (jsonb_typeof(working_content) = 'object' and jsonb_typeof(working_content -> 'blocks') = 'array'),
  supplementary_data jsonb not null default '{}'::jsonb check (jsonb_typeof(supplementary_data) = 'object'),
  origin_type text check (origin_type is null or origin_type = 'live_question'),
  origin_id uuid,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index artifacts_user_updated_idx on public.artifacts (user_id, updated_at desc);
create index artifacts_user_type_status_idx on public.artifacts (user_id, type, status);
create unique index artifacts_live_origin_idx on public.artifacts (user_id, origin_type, origin_id)
where origin_type = 'live_question' and origin_id is not null;

create table public.artifact_sources (
  artifact_id uuid not null references public.artifacts (id) on delete cascade,
  evidence_id uuid not null references public.evidences (id) on delete restrict,
  user_id uuid not null references auth.users (id) on delete cascade,
  authorized_at timestamptz not null default now(),
  removed_at timestamptz,
  primary key (artifact_id, evidence_id)
);

create index artifact_sources_user_idx on public.artifact_sources (user_id, artifact_id);

create table public.artifact_versions (
  id uuid primary key default gen_random_uuid(),
  artifact_id uuid not null references public.artifacts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  version integer not null check (version > 0),
  trigger text not null check (trigger in ('initial', 'shorter', 'deeper', 'adapted', 'alternative', 'reviewed', 'restored')),
  section_key text check (section_key is null or char_length(section_key) between 1 and 60),
  content jsonb not null check (jsonb_typeof(content) = 'object' and jsonb_typeof(content -> 'blocks') = 'array'),
  source_map jsonb not null default '{}'::jsonb check (jsonb_typeof(source_map) = 'object'),
  model text,
  prompt_version text,
  created_at timestamptz not null default now(),
  unique (artifact_id, version)
);

create index artifact_versions_artifact_idx on public.artifact_versions (artifact_id, version desc);

alter table public.artifacts enable row level security;
alter table public.artifact_sources enable row level security;
alter table public.artifact_versions enable row level security;

create policy "artifacts_select_own" on public.artifacts for select to authenticated
using ((select auth.uid()) = user_id);
create policy "artifact_sources_select_own" on public.artifact_sources for select to authenticated
using ((select auth.uid()) = user_id);
create policy "artifact_versions_select_own" on public.artifact_versions for select to authenticated
using ((select auth.uid()) = user_id);

grant select on public.artifacts, public.artifact_sources, public.artifact_versions to authenticated;

create or replace function public.create_artifact(
  p_type text,
  p_title text,
  p_objective text,
  p_opportunity_context text,
  p_supplementary_data jsonb,
  p_evidence_ids uuid[]
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_user_id uuid := auth.uid();
  new_id uuid;
  invalid_count integer;
begin
  if current_user_id is null then raise exception 'authentication required' using errcode = '42501'; end if;
  if p_type not in ('star', 'pitch', 'resume', 'portfolio')
    or char_length(trim(p_title)) not between 2 and 120
    or char_length(trim(p_objective)) not between 2 and 240
    or char_length(coalesce(p_opportunity_context, '')) > 2000
    or jsonb_typeof(p_supplementary_data) <> 'object'
    or p_evidence_ids is null or cardinality(p_evidence_ids) not between 1 and 12
  then raise exception 'invalid artifact input' using errcode = '22023'; end if;

  if cardinality(p_evidence_ids) <> cardinality(array(select distinct unnest(p_evidence_ids))) then
    raise exception 'duplicate evidence' using errcode = '22023';
  end if;

  select count(*) into invalid_count from unnest(p_evidence_ids) evidence_id
  where not exists (
    select 1 from public.evidences
    where id = evidence_id and user_id = current_user_id and status = 'confirmed'
  );
  if invalid_count > 0 then raise exception 'unauthorized evidence' using errcode = '22023'; end if;

  insert into public.artifacts (user_id, type, title, objective, opportunity_context, supplementary_data)
  values (current_user_id, p_type, trim(p_title), trim(p_objective), nullif(trim(p_opportunity_context), ''), p_supplementary_data)
  returning id into new_id;

  insert into public.artifact_sources (artifact_id, evidence_id, user_id)
  select new_id, evidence_id, current_user_id from unnest(p_evidence_ids) evidence_id;

  return new_id;
end;
$$;

create or replace function public.apply_artifact_version(
  p_artifact_id uuid,
  p_expected_revision integer,
  p_content jsonb,
  p_source_map jsonb,
  p_trigger text,
  p_section_key text,
  p_model text,
  p_prompt_version text
)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_user_id uuid := auth.uid();
  current_revision integer;
  next_version integer;
begin
  if current_user_id is null then raise exception 'authentication required' using errcode = '42501'; end if;
  if p_trigger not in ('initial', 'shorter', 'deeper', 'adapted', 'alternative')
    or jsonb_typeof(p_content) <> 'object' or jsonb_typeof(p_content -> 'blocks') <> 'array'
    or jsonb_typeof(p_source_map) <> 'object'
  then raise exception 'invalid artifact version' using errcode = '22023'; end if;

  select revision into current_revision from public.artifacts
  where id = p_artifact_id and user_id = current_user_id for update;
  if current_revision is null then raise exception 'artifact unavailable' using errcode = 'P0002'; end if;
  if current_revision <> p_expected_revision then raise exception 'artifact conflict' using errcode = '40001'; end if;

  select coalesce(max(version), 0) + 1 into next_version
  from public.artifact_versions where artifact_id = p_artifact_id;

  update public.artifacts set
    working_content = p_content,
    status = 'draft',
    reviewed_at = null,
    revision = revision + 1,
    updated_at = now()
  where id = p_artifact_id;

  insert into public.artifact_versions (
    artifact_id, user_id, version, trigger, section_key, content, source_map, model, prompt_version
  ) values (
    p_artifact_id, current_user_id, next_version, p_trigger, nullif(trim(p_section_key), ''),
    p_content, p_source_map, nullif(p_model, ''), nullif(p_prompt_version, '')
  );

  return current_revision + 1;
end;
$$;

create or replace function public.autosave_artifact(
  p_artifact_id uuid,
  p_expected_revision integer,
  p_content jsonb,
  p_supplementary_data jsonb
)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare current_user_id uuid := auth.uid(); next_revision integer;
begin
  if current_user_id is null then raise exception 'authentication required' using errcode = '42501'; end if;
  if jsonb_typeof(p_content) <> 'object' or jsonb_typeof(p_content -> 'blocks') <> 'array'
    or jsonb_typeof(p_supplementary_data) <> 'object'
  then raise exception 'invalid artifact content' using errcode = '22023'; end if;

  update public.artifacts set
    working_content = p_content,
    supplementary_data = p_supplementary_data,
    status = 'draft',
    reviewed_at = null,
    revision = revision + 1,
    updated_at = now()
  where id = p_artifact_id and user_id = current_user_id and revision = p_expected_revision
  returning revision into next_revision;

  if next_revision is null then raise exception 'artifact conflict' using errcode = '40001'; end if;
  return next_revision;
end;
$$;

create or replace function public.mark_artifact_reviewed(p_artifact_id uuid, p_expected_revision integer)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_user_id uuid := auth.uid();
  current_content jsonb;
  current_source_map jsonb;
  next_version integer;
  next_revision integer;
begin
  if current_user_id is null then raise exception 'authentication required' using errcode = '42501'; end if;
  select working_content into current_content from public.artifacts
  where id = p_artifact_id and user_id = current_user_id and revision = p_expected_revision for update;
  if current_content is null then raise exception 'artifact conflict' using errcode = '40001'; end if;
  if jsonb_array_length(current_content -> 'blocks') = 0 then raise exception 'empty artifact' using errcode = '22023'; end if;

  select coalesce(max(version), 0) + 1 into next_version from public.artifact_versions where artifact_id = p_artifact_id;
  select coalesce(source_map, '{}'::jsonb) into current_source_map from public.artifact_versions
  where artifact_id = p_artifact_id order by version desc limit 1;

  update public.artifacts set status = 'reviewed', reviewed_at = now(), revision = revision + 1, updated_at = now()
  where id = p_artifact_id returning revision into next_revision;

  insert into public.artifact_versions (artifact_id, user_id, version, trigger, content, source_map)
  values (p_artifact_id, current_user_id, next_version, 'reviewed', current_content, coalesce(current_source_map, '{}'::jsonb));
  return next_revision;
end;
$$;

create or replace function public.restore_artifact_version(
  p_artifact_id uuid,
  p_version_id uuid,
  p_expected_revision integer
)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_user_id uuid := auth.uid();
  restored_content jsonb;
  restored_source_map jsonb;
  next_version integer;
  next_revision integer;
begin
  if current_user_id is null then raise exception 'authentication required' using errcode = '42501'; end if;
  perform 1 from public.artifacts where id = p_artifact_id and user_id = current_user_id and revision = p_expected_revision for update;
  if not found then raise exception 'artifact conflict' using errcode = '40001'; end if;

  select content, source_map into restored_content, restored_source_map from public.artifact_versions
  where id = p_version_id and artifact_id = p_artifact_id and user_id = current_user_id;
  if restored_content is null then raise exception 'version unavailable' using errcode = 'P0002'; end if;

  select coalesce(max(version), 0) + 1 into next_version from public.artifact_versions where artifact_id = p_artifact_id;
  update public.artifacts set working_content = restored_content, status = 'draft', reviewed_at = null,
    revision = revision + 1, updated_at = now() where id = p_artifact_id returning revision into next_revision;
  insert into public.artifact_versions (artifact_id, user_id, version, trigger, content, source_map)
  values (p_artifact_id, current_user_id, next_version, 'restored', restored_content, restored_source_map);
  return next_revision;
end;
$$;

create or replace function public.create_artifact_from_live(p_question_id uuid, p_version_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_user_id uuid := auth.uid();
  question_value text;
  draft_value text;
  arguments_value jsonb;
  evidence_ids_value uuid[];
  session_context text;
  new_id uuid;
begin
  if current_user_id is null then raise exception 'authentication required' using errcode = '42501'; end if;
  select id into new_id from public.artifacts
  where user_id = current_user_id and origin_type = 'live_question' and origin_id = p_question_id;
  if new_id is not null then return new_id; end if;

  select q.question_text, v.draft_text, v.arguments, v.evidence_ids,
    concat_ws(' · ', s.target_role, s.company)
  into question_value, draft_value, arguments_value, evidence_ids_value, session_context
  from public.live_questions q
  join public.live_sessions s on s.id = q.session_id and s.user_id = current_user_id
  join public.live_draft_versions v on v.question_id = q.id and v.user_id = current_user_id
  where q.id = p_question_id and q.user_id = current_user_id and v.id = p_version_id and v.draft_text is not null;

  if draft_value is null then raise exception 'live response unavailable' using errcode = 'P0002'; end if;

  insert into public.artifacts (
    user_id, type, title, objective, opportunity_context, working_content, origin_type, origin_id
  ) values (
    current_user_id, 'star', left('Resposta STAR — ' || question_value, 120), question_value, session_context,
    jsonb_build_object('blocks', jsonb_build_array(jsonb_build_object('key', 'star', 'label', 'Resposta STAR', 'body', draft_value))),
    'live_question', p_question_id
  ) returning id into new_id;

  insert into public.artifact_sources (artifact_id, evidence_id, user_id)
  select new_id, evidence_id, current_user_id from unnest(evidence_ids_value) evidence_id;

  insert into public.artifact_versions (artifact_id, user_id, version, trigger, content, source_map, model, prompt_version)
  select new_id, current_user_id, 1, 'initial',
    jsonb_build_object('blocks', jsonb_build_array(jsonb_build_object('key', 'star', 'label', 'Resposta STAR', 'body', draft_value))),
    jsonb_build_object('star', arguments_value), model, prompt_version
  from public.live_draft_versions where id = p_version_id;

  return new_id;
end;
$$;

revoke all on function public.create_artifact(text, text, text, text, jsonb, uuid[]) from public;
revoke all on function public.apply_artifact_version(uuid, integer, jsonb, jsonb, text, text, text, text) from public;
revoke all on function public.autosave_artifact(uuid, integer, jsonb, jsonb) from public;
revoke all on function public.mark_artifact_reviewed(uuid, integer) from public;
revoke all on function public.restore_artifact_version(uuid, uuid, integer) from public;
revoke all on function public.create_artifact_from_live(uuid, uuid) from public;
grant execute on function public.create_artifact(text, text, text, text, jsonb, uuid[]) to authenticated;
grant execute on function public.apply_artifact_version(uuid, integer, jsonb, jsonb, text, text, text, text) to authenticated;
grant execute on function public.autosave_artifact(uuid, integer, jsonb, jsonb) to authenticated;
grant execute on function public.mark_artifact_reviewed(uuid, integer) to authenticated;
grant execute on function public.restore_artifact_version(uuid, uuid, integer) to authenticated;
grant execute on function public.create_artifact_from_live(uuid, uuid) to authenticated;
