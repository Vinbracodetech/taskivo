create or replace function public.offerwall_gg_pending_balance()
returns numeric
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce(sum(amount_pts),0)
  from public.offerwall_gg_events
  where user_id = (select auth.uid());
$$;
revoke all on function public.offerwall_gg_pending_balance() from public, anon;
grant execute on function public.offerwall_gg_pending_balance() to authenticated;
