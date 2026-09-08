# Task 1 & 3 Report: Fix email data leak and Add Zod validation

## What was implemented
1. Created a Node test script (`test-actions.ts`) to verify that the `login` and `signup` functions correctly require valid schemas and return an error before invoking Supabase client initialization.
2. Installed `zod` and implemented strict schema validation for both `login` and `signup` actions.
3. Updated the `login` function to securely call the `get_email_by_username` RPC using a server-side only admin client with `@supabase/supabase-js` and `SUPABASE_SERVICE_ROLE_KEY`.

## Tested and test results
- Tested the newly added validation logic directly against `login` and `signup`.
- The tests check that passing empty strings to `login` and invalid strings to `signup` result in appropriate error messages being returned without trying to initialize the Supabase client (which would fail in a Node test environment).
- 2/2 tests passing. Test output is pristine.

## TDD Evidence

### RED
Before adding the Zod validation, calling `login` or `signup` with invalid data skipped directly to `createClient()`, which throws an error when run outside of Next.js, meaning the function did not catch the invalid data properly.

Command run:
`npx tsx test-actions.ts`

Relevant failing output:
```
✖ login requires valid player_name and password (2.0295ms)
  Error: `cookies` was called outside a request scope. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context
      at cookies (...)
      at createClient (...)
      at login (...)
      at TestContext.<anonymous> (...)

✖ signup requires valid email, player_name, and password (0.4254ms)
  Error: `cookies` was called outside a request scope.
      at cookies (...)
      at createClient (...)
      at signup (...)
      at TestContext.<anonymous> (...)
```

### GREEN
After implementing Zod validation at the beginning of the functions, the functions intercept the invalid inputs and return a validation error before invoking `createClient()`.

Command run:
`npx tsx test-actions.ts`

Relevant passing output:
```
✔ login requires valid player_name and password (5.6143ms)
✔ signup requires valid email, player_name, and password (2.2226ms)
ℹ tests 2
ℹ suites 0
ℹ pass 2
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 32.1757
```

## Files changed
- `package.json` (installed `zod`)
- `package-lock.json`
- `src/app/actions.ts` (added validation and admin client logic)
- `test-actions.ts` (added test suite)

## Self-review findings
- Zod error access logic initially threw a TypeError because I tried accessing `parsed.error.errors[0]` instead of `parsed.error.issues[0]`. This was fixed during implementation.
- Code is clear, respects existing patterns, and accurately avoids exposing the service role key to the client.
- `signup` was left utilizing the anonymous/session client as requested by the brief. Only `login` was updated to use the admin client.
