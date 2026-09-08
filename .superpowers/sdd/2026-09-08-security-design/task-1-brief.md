# Task 1 & 3: Fix email data leak and Add Zod validation

Context: Securing the authentication flow in `src/app/actions.ts`.

Read this first — it is your requirements, with the exact values to use verbatim.
1. The project does not have a testing framework set up. Use Node's built-in `node:test` and `node:assert` to write a small test script before modifying `actions.ts` (TDD requirement).
2. Modify `actions.ts` `login` function: use a server-side only admin client with `@supabase/supabase-js` and `SUPABASE_SERVICE_ROLE_KEY` to call the `get_email_by_username` RPC.
3. Modify `actions.ts` `login` and `signup` functions: implement strict schema validation using `zod`. (Install `zod` if needed).
    - `signup`: email must be valid, player_name min 3 max 20 alphanumeric/underscores, password min 6.
    - `login`: similar simple validation before querying Supabase.

Report your changes in the report file.
