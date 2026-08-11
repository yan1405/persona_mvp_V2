alter table public.evidences
  alter column source_log_id drop not null;

create policy "evidences_insert_own"
on public.evidences for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and status = 'confirmed'
  and source_log_id is null
  and suggestion_id is null
);

create policy "evidences_update_own"
on public.evidences for update
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and (
    source_log_id is null
    or exists (
      select 1
      from public.daily_logs
      where daily_logs.id = evidences.source_log_id
        and daily_logs.user_id = (select auth.uid())
    )
  )
  and (
    suggestion_id is null
    or exists (
      select 1
      from public.evidence_suggestions
      where evidence_suggestions.id = evidences.suggestion_id
        and evidence_suggestions.user_id = (select auth.uid())
    )
  )
);

grant insert, update on public.evidences to authenticated;

create table public.evidence_sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  evidence_id uuid not null references public.evidences (id) on delete cascade,
  source_type text not null default 'link' check (source_type = 'link'),
  title text check (title is null or char_length(title) between 2 and 100),
  url text not null check (
    char_length(url) between 8 and 2048
    and url ~* '^https?://'
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (evidence_id, url)
);

create index evidence_sources_user_evidence_idx
on public.evidence_sources (user_id, evidence_id, created_at desc);

alter table public.evidence_sources enable row level security;

create policy "evidence_sources_select_own"
on public.evidence_sources for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "evidence_sources_insert_own"
on public.evidence_sources for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.evidences
    where evidences.id = evidence_sources.evidence_id
      and evidences.user_id = (select auth.uid())
      and evidences.status = 'confirmed'
  )
);

create policy "evidence_sources_update_own"
on public.evidence_sources for update
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.evidences
    where evidences.id = evidence_sources.evidence_id
      and evidences.user_id = (select auth.uid())
      and evidences.status = 'confirmed'
  )
);

create policy "evidence_sources_delete_own"
on public.evidence_sources for delete
to authenticated
using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.evidence_sources to authenticated;
