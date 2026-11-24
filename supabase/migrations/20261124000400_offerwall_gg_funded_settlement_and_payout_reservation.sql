begin;
create table taskivo_private.offerwall_gg_receipts(
 receipt_reference text primary key check(length(receipt_reference) between 3 and 200),
 net_received_usd_cents bigint not null check(net_received_usd_cents between 1 and 1000000000),
 received_at timestamptz not null,
 recorded_at timestamptz not null default now()
);
create table taskivo_private.offerwall_gg_allocations(
 transaction_id text primary key,
 receipt_reference text not null references taskivo_private.offerwall_gg_receipts(receipt_reference),
 user_id uuid references public.profiles(id) on delete set null,
 amount_pts numeric(20,6) not null check(amount_pts>0),
 allocated_at timestamptz not null default now()
);
create index offerwall_gg_allocations_user_idx on taskivo_private.offerwall_gg_allocations(user_id);
create table taskivo_private.offerwall_gg_payout_requests(
 id uuid primary key default gen_random_uuid(),
 user_id uuid references public.profiles(id) on delete set null,
 amount_pts bigint not null check(amount_pts>=100),
 bank_name text not null,
 account_name text not null,
 account_number text not null,
 status text not null default 'pending' check(status in ('pending','paid','rejected')),
 requested_at timestamptz not null default now()
);
create index offerwall_gg_payout_user_idx on taskivo_private.offerwall_gg_payout_requests(user_id);
create table taskivo_private.offerwall_gg_controls(
 singleton boolean primary key default true check(singleton),
 withdrawals_enabled boolean not null default false
);
insert into taskivo_private.offerwall_gg_controls(singleton) values(true);
alter table taskivo_private.offerwall_gg_receipts enable row level security;
alter table taskivo_private.offerwall_gg_allocations enable row level security;
alter table taskivo_private.offerwall_gg_payout_requests enable row level security;
alter table taskivo_private.offerwall_gg_controls enable row level security;
revoke all on all tables in schema taskivo_private from public,anon,authenticated;
-- Privileged operator records a real, reconciled receipt; never treat a callback as settled cash.
create or replace function taskivo_private.allocate_offerwall_gg_receipt(p_reference text,p_cents bigint,p_received_at timestamptz,p_transactions text[])
returns numeric language plpgsql security definer set search_path=''
as $$
declare
 v_total numeric;
 v_count integer;
begin
 if current_setting('role',true) not in ('service_role','postgres') and session_user <> 'postgres' then raise exception 'Operator required'; end if;
 if p_cents is null or p_cents<1 or p_cents>1000000000 or p_received_at is null or p_received_at>now() or p_transactions is null or cardinality(p_transactions)<1 or cardinality(p_transactions)>10000 then raise exception 'Invalid receipt'; end if;
 if exists(select 1 from unnest(p_transactions) as u(tx) where tx is null) or cardinality(p_transactions)<>(select count(distinct tx) from unnest(p_transactions) as u(tx)) then raise exception 'Duplicate or missing transaction IDs'; end if;
 select count(*),coalesce(sum(c.amount_pts),0) into v_count,v_total
 from public.offerwall_gg_events c
 where c.transaction_id=any(p_transactions) and c.event_type='credited' and c.user_id is not null
 and not exists(select 1 from public.offerwall_gg_events r where r.transaction_id=c.transaction_id and r.event_type='reversed')
 and not exists(select 1 from taskivo_private.offerwall_gg_allocations a where a.transaction_id=c.transaction_id);
 if v_count<>cardinality(p_transactions) then raise exception 'One or more conversions are missing, reversed or already allocated'; end if;
 if v_total>floor(p_cents::numeric*533/100) then raise exception 'Insufficient receipt funding'; end if;
 insert into taskivo_private.offerwall_gg_receipts(receipt_reference,net_received_usd_cents,received_at) values(p_reference,p_cents,p_received_at);
 insert into taskivo_private.offerwall_gg_allocations(transaction_id,receipt_reference,user_id,amount_pts)
 select c.transaction_id,p_reference,c.user_id,c.amount_pts from public.offerwall_gg_events c
 where c.transaction_id=any(p_transactions) and c.event_type='credited' and c.user_id is not null;
 return v_total;
end; $$;
revoke all on function taskivo_private.allocate_offerwall_gg_receipt(text,bigint,timestamptz,text[]) from public,anon,authenticated;
grant execute on function taskivo_private.allocate_offerwall_gg_receipt(text,bigint,timestamptz,text[]) to service_role;
-- Only this private function reads settlement data. A user sees their own balances.
create or replace function taskivo_private.offerwall_gg_balance_for(p_user uuid)
returns table(pending_pts numeric,settled_pts numeric,available_pts numeric,withdrawals_enabled boolean)
language sql stable security definer set search_path=''
as $$
 with pending as (
  select coalesce(sum(e.amount_pts),0) n from public.offerwall_gg_events e
  where e.user_id=p_user and not exists(select 1 from taskivo_private.offerwall_gg_allocations a where a.transaction_id=e.transaction_id)
 ), settled as (
  select coalesce(sum(a.amount_pts),0) n from taskivo_private.offerwall_gg_allocations a where a.user_id=p_user
 ), reversed as (
  select coalesce(sum(r.amount_pts),0) n from public.offerwall_gg_events r join taskivo_private.offerwall_gg_allocations a using(transaction_id)
  where a.user_id=p_user and r.event_type='reversed' and r.user_id=p_user
 ), spent as (
  select coalesce(sum(amount_pts),0) n from taskivo_private.offerwall_gg_payout_requests where user_id=p_user and status in ('pending','paid')
 )
 select pending.n,settled.n+reversed.n, greatest(0, floor(settled.n+reversed.n-spent.n)), c.withdrawals_enabled
 from pending,settled,reversed,spent,taskivo_private.offerwall_gg_controls c where c.singleton;
$$;
revoke all on function taskivo_private.offerwall_gg_balance_for(uuid) from public,anon,authenticated;
-- Authenticated caller derives identity from its JWT, not from client input.
create or replace function taskivo_private.my_offerwall_gg_balances()
returns table(pending_pts numeric,settled_pts numeric,available_pts numeric,withdrawals_enabled boolean)
language plpgsql stable security definer set search_path=''
as $$ begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 return query select * from taskivo_private.offerwall_gg_balance_for(auth.uid());
end; $$;
revoke all on function taskivo_private.my_offerwall_gg_balances() from public,anon;
grant execute on function taskivo_private.my_offerwall_gg_balances() to authenticated;
create or replace function public.offerwall_gg_balances()
returns table(pending_pts numeric,settled_pts numeric,available_pts numeric,withdrawals_enabled boolean)
language sql stable security invoker set search_path=''
as $$ select * from taskivo_private.my_offerwall_gg_balances(); $$;
revoke all on function public.offerwall_gg_balances() from public,anon;
grant execute on function public.offerwall_gg_balances() to authenticated;
-- Requests only reserve settled funds, never deduct the legacy points balance or send money.
create or replace function taskivo_private.request_offerwall_gg_payout(p_amount bigint)
returns uuid language plpgsql security definer set search_path=''
as $$
declare u uuid:=auth.uid(); p public.profiles%rowtype; b record; v_id uuid;
begin
 if u is null then raise exception 'Authentication required'; end if;
 if p_amount is null or p_amount<100 or p_amount>1000000000000 then raise exception 'Invalid withdrawal amount'; end if;
 select * into p from public.profiles where id=u for update;
 if not found or p.role is distinct from 'earner' then raise exception 'Earner account required'; end if;
 if coalesce(trim(p.payout_account),'')='' or coalesce(trim(p.payout_bank_name),'')='' or coalesce(trim(p.payout_account_name),'')='' then raise exception 'Payout destination required'; end if;
 select * into b from taskivo_private.offerwall_gg_balance_for(u);
 if b.withdrawals_enabled is distinct from true then raise exception 'Withdrawals are temporarily paused'; end if;
 if p_amount>b.available_pts then raise exception 'Insufficient settled balance'; end if;
 insert into taskivo_private.offerwall_gg_payout_requests(user_id,amount_pts,bank_name,account_name,account_number)
 values(u,p_amount,p.payout_bank_name,p.payout_account_name,p.payout_account) returning id into v_id;
 return v_id;
end; $$;
revoke all on function taskivo_private.request_offerwall_gg_payout(bigint) from public,anon;
grant execute on function taskivo_private.request_offerwall_gg_payout(bigint) to authenticated;
create or replace function public.request_offerwall_gg_payout(p_amount bigint)
returns uuid language sql security invoker set search_path=''
as $$ select taskivo_private.request_offerwall_gg_payout(p_amount); $$;
revoke all on function public.request_offerwall_gg_payout(bigint) from public,anon;
grant execute on function public.request_offerwall_gg_payout(bigint) to authenticated;
commit;