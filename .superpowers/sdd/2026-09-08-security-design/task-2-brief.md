# Task 2 & 5: Revoke public RPC access and Implement RLS Policies

Context: Securing the Supabase backend configuration.
Read this first — it is your requirements, with the exact values to use verbatim.

Create two SQL files in `supabase/` directory (create the directory if it doesn't exist).
1. `supabase/security_rpc.sql`:
   - Revoke EXECUTE on function `get_email_by_username(text)` from `anon` and `authenticated`.
   - Grant EXECUTE on function `get_email_by_username(text)` to `service_role`.
2. `supabase/rls_policies.sql`:
   - Enable Row Level Security (RLS) on tables `leaderboard` and `profiles`.
   - Leaderboard: Public can select.
   - Leaderboard: Users can insert and update ONLY their own score (`auth.uid() = user_id`).
   - Profiles: Public can select.
   - Profiles: Users can update ONLY their own profile (`auth.uid() = id`).

Since these are SQL configuration scripts, TDD (writing failing automated tests) is not required for this specific task.
