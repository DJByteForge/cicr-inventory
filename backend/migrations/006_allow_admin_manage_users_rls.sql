-- ============ 006_allow_admin_manage_users_rls.sql ============
-- Fixes deletion, update, and management permissions on public.users table in Supabase.
-- Run this in your Supabase SQL Editor:

-- 1. Disable Row Level Security on the users table so backend admin operations succeed
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 2. Grant full CRUD permissions to anon and authenticated roles
GRANT ALL ON TABLE public.users TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.borrow_records TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.audit_logs TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.inventory TO anon, authenticated, service_role;
