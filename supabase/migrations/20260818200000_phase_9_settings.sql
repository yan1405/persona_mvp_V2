create table if not exists public.sensitive_action_authorizations (
  user_id uuid not null references auth.users (id) on delete cascade,
  purpose text not null check (purpose in ('delete_account')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  primary key (user_id, purpose)
);

alter table public.sensitive_action_authorizations enable row level security;

revoke all on table public.sensitive_action_authorizations from public, anon, authenticated;

create or replace function public.authorize_sensitive_action(p_purpose text)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
  current_user_id uuid;
begin
  current_user_id := auth.uid();

  if current_user_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  if p_purpose <> 'delete_account' then
    raise exception 'invalid sensitive action' using errcode = '22023';
  end if;

  insert into public.sensitive_action_authorizations (
    user_id,
    purpose,
    expires_at
  ) values (
    current_user_id,
    p_purpose,
    now() + interval '5 minutes'
  )
  on conflict (user_id, purpose) do update
  set expires_at = excluded.expires_at,
      created_at = now();
end;
$$;

drop function if exists public.delete_own_account();

create function public.delete_own_account(p_confirmation text)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
  current_user_id uuid;
  authorized_user_id uuid;
begin
  current_user_id := auth.uid();

  if current_user_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  if p_confirmation <> 'EXCLUIR' then
    raise exception 'invalid confirmation' using errcode = '22023';
  end if;

  delete from public.sensitive_action_authorizations
  where user_id = current_user_id
    and purpose = 'delete_account'
    and expires_at > now()
  returning user_id into authorized_user_id;

  if authorized_user_id is null then
    raise exception 'recent reauthentication required' using errcode = '42501';
  end if;

  delete from auth.users where id = current_user_id;

  if not found then
    raise exception 'account not found' using errcode = 'P0002';
  end if;
end;
$$;

revoke all on function public.authorize_sensitive_action(text) from public;
revoke all on function public.delete_own_account(text) from public;
grant execute on function public.authorize_sensitive_action(text) to authenticated;
grant execute on function public.delete_own_account(text) to authenticated;
