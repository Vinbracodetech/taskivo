-- Taskivo Play & Earn screenshot-review pilot.
-- IMPORTANT: Review on a Supabase staging project before running in production.
-- Intentionally does NOT credit profiles.points or enable payouts.

create table if not exists public.game_proofs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  game_id text not null check (game_id in ('candy-crush-glass','glass-puzzle-zen')),
  milestone integer not null check (milestone >= 0 and milestone % 10 = 0),
  reward_points integer not null check (reward_points > 0),
  proof_path text not null,
  notes text not null default '',
  status text not null default 'pending' check (status in ('pending','verified_unpaid','rejected')),
  review_note text,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id,game_id,milestone)
);
create index if not exists game_proofs_pending_idx on public.game_proofs(status,created_at);
create index if not exists game_proofs_user_idx on public.game_proofs(user_id,game_id);

alter table public.game_proofs enable row level security;
revoke all on public.game_proofs from anon;
grant select on public.game_proofs to authenticated;
-- No direct INSERT/UPDATE/DELETE privileges for users: only SECURITY DEFINER RPCs.

create or replace function public.is_taskivo_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.profiles where id = (select auth.uid()) and role = 'admin');
$$;
revoke all on function public.is_taskivo_admin() from public;
grant execute on function public.is_taskivo_admin() to authenticated;

create policy "User sees own game proofs" on public.game_proofs
for select to authenticated using (user_id = (select auth.uid()) or public.is_taskivo_admin());

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('game-proofs','game-proofs',false,5242880,array['image/png','image/jpeg','image/webp'])
on conflict (id) do update set public=false,file_size_limit=5242880,allowed_mime_types=array['image/png','image/jpeg','image/webp'];

create policy "Game proof owner can upload" on storage.objects
for insert to authenticated with check (
  bucket_id='game-proofs' and (storage.foldername(name))[1]=(select auth.uid())::text
);
create policy "Game proof owner or admin can read" on storage.objects
for select to authenticated using (
  bucket_id='game-proofs' and ((storage.foldername(name))[1]=(select auth.uid())::text or public.is_taskivo_admin())
);
create policy "Game proof owner can delete own upload" on storage.objects
for delete to authenticated using (
  bucket_id='game-proofs' and (storage.foldername(name))[1]=(select auth.uid())::text
);

create or replace function public.submit_game_proof(
  p_game_id text, p_milestone integer, p_proof_path text, p_notes text default ''
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  v_max integer;
  v_reward integer;
  v_id uuid;
  v_existing public.game_proofs%rowtype;
begin
  if v_uid is null then raise exception 'Authentication required'; end if;
  v_max := case p_game_id when 'candy-crush-glass' then 140 when 'glass-puzzle-zen' then 200 else null end;
  if v_max is null or p_milestone is null or p_milestone < 0 or p_milestone > v_max or mod(p_milestone,10) <> 0 then
    raise exception 'Invalid game or milestone';
  end if;
  if p_proof_path is null or left(p_proof_path,length(v_uid::text)+1) <> v_uid::text || '/' then
    raise exception 'Proof path must belong to signed-in user';
  end if;
  if not exists(select 1 from storage.objects where bucket_id='game-proofs' and name=p_proof_path) then
    raise exception 'Upload screenshot before submitting';
  end if;
  v_reward := case when p_milestone=0 then 50 when p_milestone=10 then 80 when p_milestone=20 then 100
    else 150 + ((p_milestone / 10) - 3)*50 end;
  -- One row per user/game/milestone. Only rejected proofs can be replaced.
  select * into v_existing from public.game_proofs
    where user_id=v_uid and game_id=p_game_id and milestone=p_milestone for update;
  if found then
    if v_existing.status <> 'rejected' then raise exception 'Milestone already submitted'; end if;
    update public.game_proofs set proof_path=p_proof_path,notes=left(coalesce(p_notes,''),500),
      status='pending',reward_points=v_reward,review_note=null,reviewed_by=null,reviewed_at=null,
      updated_at=now() where id=v_existing.id returning id into v_id;
  else
    insert into public.game_proofs(user_id,game_id,milestone,reward_points,proof_path,notes)
    values(v_uid,p_game_id,p_milestone,v_reward,p_proof_path,left(coalesce(p_notes,''),500))
    returning id into v_id;
  end if;
  return v_id;
end;
$$;
revoke all on function public.submit_game_proof(text,integer,text,text) from public;
grant execute on function public.submit_game_proof(text,integer,text,text) to authenticated;

create or replace function public.review_game_proof(
  p_proof_id uuid, p_approve boolean, p_review_note text default null
) returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_taskivo_admin() then raise exception 'Admin access required'; end if;
  if p_approve is null then raise exception 'Review decision required'; end if;
  if not p_approve and nullif(btrim(coalesce(p_review_note,'')),'') is null then
    raise exception 'Rejection reason required';
  end if;
  update public.game_proofs set
    status = case when p_approve then 'verified_unpaid' else 'rejected' end,
    review_note=left(coalesce(p_review_note,''),500),reviewed_by=auth.uid(),reviewed_at=now(),updated_at=now()
  where id=p_proof_id and status='pending';
  if not found then raise exception 'Proof not pending or already reviewed'; end if;
  -- Intentionally NO balance update. A separate, audited payout mechanism is required.
end;
$$;
revoke all on function public.review_game_proof(uuid,boolean,text) from public;
grant execute on function public.review_game_proof(uuid,boolean,text) to authenticated;
  
