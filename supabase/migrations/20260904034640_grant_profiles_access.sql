-- The init migration enabled RLS and added policies on public.profiles,
-- but never granted the authenticated role table-level access — RLS only
-- restricts *rows* once a role already has SELECT/INSERT/UPDATE/DELETE
-- privilege on the table; without the grant, Postgres denies the query
-- before RLS is ever evaluated ("permission denied for table profiles").
-- Supabase doesn't grant this automatically for every project, so it has
-- to be explicit.
grant select, insert, update, delete on public.profiles to authenticated;
