begin;
create schema if not exists taskivo_private;
revoke all on schema taskivo_private from public, anon, authenticated;
grant usage on schema taskivo_private to authenticated;
create or replace function taskivo_private.is_admin()
returns boolean language sql stable security definer set search_path=''
as $$ select exists(select 1 from public.profiles where id=(select auth.uid()) and role='admin'); $$;
revoke all on function taskivo_private.is_admin() from public, anon;
grant execute on function taskivo_private.is_admin() to authenticated;
alter policy "Users can view profiles" on public.profiles to authenticated using ((select taskivo_private.is_admin()));
alter policy "Users can view own profile" on public.profiles to authenticated using (id=(select auth.uid()));
alter policy "Authenticated users can update profiles" on public.profiles to authenticated using (false) with check (false);
alter policy "Users can update own profile" on public.profiles to authenticated using (id=(select auth.uid())) with check (id=(select auth.uid()));
alter policy "Users can insert their own profile" on public.profiles to authenticated with check (id=(select auth.uid()) and role in ('earner','creator') and points=0 and coalesce(pilot_claimed,false)=false);
revoke all on public.profiles from public, anon, authenticated;
grant select on public.profiles to authenticated;
grant insert (id,email,full_name,avatar_url,role,points,pilot_claimed,local_currency,country) on public.profiles to authenticated;
grant update (full_name,avatar_url,country,payment_method,payment_details,payout_account,payout_bank_name,payout_account_name,local_currency,device_id) on public.profiles to authenticated;
alter policy "Authenticated users can view all withdrawals" on public.withdrawals to authenticated using (user_id=(select auth.uid()) or (select taskivo_private.is_admin()));
alter policy "Authenticated users can update withdrawals" on public.withdrawals to authenticated using (false) with check (false);
alter policy "Users can insert their own withdrawals" on public.withdrawals to authenticated with check (false);
revoke all on public.withdrawals from public,anon,authenticated;
grant select on public.withdrawals to authenticated;
-- Temporary freeze of legacy money-generating writes until server-side verification and escrow are audited.
revoke insert,update,delete,truncate on public.completions,public.tasks,public.transactions,public.telegram_claims,public.blog_reads from public,anon,authenticated;
alter table public.task_sessions enable row level security;
revoke all on public.task_sessions from public,anon,authenticated;
grant select on public.task_sessions to authenticated;
create policy taskivo_sessions_owner_or_admin on public.task_sessions for select to authenticated using (user_id=(select auth.uid()) or (select taskivo_private.is_admin()));
revoke execute on function public.apply_referral_bonus(uuid,text), public.increment_ad_reward(uuid,integer),public.inject_daily_blog_tasks() from public,anon,authenticated;
-- Keep the public article catalog readable, but not unpublished posts.
alter policy "Posts are viewable by everyone" on public.posts to anon,authenticated using (status='published');
commit;