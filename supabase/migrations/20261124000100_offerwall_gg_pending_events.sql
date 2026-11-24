-- Offerwall.GG events are deliberately separate from profiles.points.
-- Apply only to Taskivo, after backing up and confirming profiles.id is UUID.
begin;
create table if not exists public.offerwall_gg_events (
  transaction_id text not null check (length(transaction_id) between 1 and 200),
  event_type text not null check (event_type in ('credited','reversed')),
  user_id uuid references public.profiles(id) on delete set null,
  amount_pts numeric(20,6) not null check (
    (event_type='credited' and amount_pts>0) or
    (event_type='reversed' and amount_pts<0)
  ),
  received_at timestamptz not null default now(),
  primary key (transaction_id,event_type)
);
alter table public.offerwall_gg_events enable row level security;
revoke all on public.offerwall_gg_events from public, anon, authenticated;
grant select on public.offerwall_gg_events to authenticated;
grant select, insert on public.offerwall_gg_events to service_role;
create policy offerwall_gg_read_own on public.offerwall_gg_events for select to authenticated using ((select auth.uid())=user_id);
create index if not exists offerwall_gg_events_user_idx on public.offerwall_gg_events(user_id);
-- No trigger or RPC increases withdrawable balances. Settlement requires reconciliation
-- against actual provider remittances and a separate audited payout workflow.
commit;
