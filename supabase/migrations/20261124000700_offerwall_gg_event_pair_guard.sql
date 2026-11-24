create or replace function taskivo_private.check_offerwall_gg_event_pair()
returns trigger language plpgsql set search_path=''
as $$
declare existing public.offerwall_gg_events%rowtype;
begin
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(new.transaction_id,0));
  select * into existing from public.offerwall_gg_events
  where transaction_id=new.transaction_id and event_type<>new.event_type;
  if found and (existing.user_id is distinct from new.user_id or existing.amount_pts <> -new.amount_pts) then
    raise exception 'Offerwall credit/reversal mismatch' using errcode='23514';
  end if;
  return new;
end; $$;
revoke all on function taskivo_private.check_offerwall_gg_event_pair() from public,anon,authenticated;
create trigger offerwall_gg_event_pair_guard
before insert on public.offerwall_gg_events
for each row execute function taskivo_private.check_offerwall_gg_event_pair();
