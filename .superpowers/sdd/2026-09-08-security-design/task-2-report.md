# Task 2 & 5 Report: Revoke public RPC access and Implement RLS Policies

## What was implemented
- Created `supabase/security_rpc.sql` to revoke EXECUTE on the `get_email_by_username` RPC from `anon` and `authenticated` roles, and instead grant it to `service_role`.
- Created `supabase/rls_policies.sql` to enable RLS on `leaderboard` and `profiles` tables.
- Implemented RLS policies for `leaderboard`:
  - Allow public to SELECT.
  - Allow users to INSERT and UPDATE only their own scores (`auth.uid() = user_id`).
- Implemented RLS policies for `profiles`:
  - Allow public to SELECT.
  - Allow users to UPDATE only their own profile (`auth.uid() = id`).

## Testing & Results
No automated tests (TDD) were required for these SQL configuration scripts, per the task brief. The files were visually reviewed to ensure correctness.

## TDD Evidence
N/A - Explicitly skipped per task brief: "Since these are SQL configuration scripts, TDD (writing failing automated tests) is not required for this specific task."

## Files Changed
- `supabase/security_rpc.sql` (created)
- `supabase/rls_policies.sql` (created)

## Self-Review Findings
- **Completeness:** Both tasks 2 and 5 were fully implemented with the exact requirements requested.
- **Quality:** SQL syntax used is standard PostgreSQL and matches standard Supabase configuration conventions.
- **Discipline:** No extra code added beyond requirements.
- **Testing:** Confirmed not needed based on instructions.

## Concerns
- None. The changes exactly match the brief.
