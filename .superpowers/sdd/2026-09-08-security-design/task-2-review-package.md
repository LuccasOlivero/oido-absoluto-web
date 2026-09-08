Commits:
0a198e5 chore(supabase): revoke public RPC and implement RLS policies

Stat summary:
 supabase/rls_policies.sql | 22 ++++++++++++++++++++++
 supabase/security_rpc.sql |  5 +++++
 2 files changed, 27 insertions(+)

Diff:
diff --git a/supabase/rls_policies.sql b/supabase/rls_policies.sql
new file mode 100644
index 0000000..bd428d9
--- /dev/null
+++ b/supabase/rls_policies.sql
@@ -0,0 +1,22 @@
+-- Enable Row Level Security (RLS) on tables leaderboard and profiles
+ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
+ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
+
+-- Leaderboard: Public can select.
+CREATE POLICY "Public can select leaderboard" ON public.leaderboard
+    FOR SELECT USING (true);
+
+-- Leaderboard: Users can insert and update ONLY their own score (auth.uid() = user_id).
+CREATE POLICY "Users can insert their own score" ON public.leaderboard
+    FOR INSERT WITH CHECK (auth.uid() = user_id);
+
+CREATE POLICY "Users can update their own score" ON public.leaderboard
+    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
+
+-- Profiles: Public can select.
+CREATE POLICY "Public can select profiles" ON public.profiles
+    FOR SELECT USING (true);
+
+-- Profiles: Users can update ONLY their own profile (auth.uid() = id).
+CREATE POLICY "Users can update their own profile" ON public.profiles
+    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
diff --git a/supabase/security_rpc.sql b/supabase/security_rpc.sql
new file mode 100644
index 0000000..add009e
--- /dev/null
+++ b/supabase/security_rpc.sql
@@ -0,0 +1,5 @@
+-- Revoke EXECUTE on function get_email_by_username(text) from anon and authenticated.
+REVOKE EXECUTE ON FUNCTION public.get_email_by_username(text) FROM anon, authenticated;
+
+-- Grant EXECUTE on function get_email_by_username(text) to service_role.
+GRANT EXECUTE ON FUNCTION public.get_email_by_username(text) TO service_role;

