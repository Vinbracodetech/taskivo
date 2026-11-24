alter policy "Admins can manage posts" on public.posts to authenticated using ((select taskivo_private.is_admin())) with check ((select taskivo_private.is_admin()));
