# Oído Absoluto Security Spec

## Goal
Secure the application to safely handle 5,000 users without data leaks, focusing on the critical email leak via RPC, form data validation, rate limiting, RLS policies, and HTTP security headers.

## Constraints & Requirements
- No data leaks allowed (emails must be private).
- No major UX changes (transparent security improvements).
- Use `zod` for validation.
- Implement server-side admin client for the `get_email_by_username` lookup.

## Approaches & Decisions
- **RPC Access**: Revoke `anon` and `authenticated` access to `get_email_by_username` and restrict it strictly to `service_role`.
- **Validation**: Implement Zod parsing in `actions.ts`.
- **Headers**: Implement `next.config.ts` Content Security Policy and related strict headers.
- **RLS**: Lock down leaderboard inserts to the `auth.uid()` constraint.

## Implementation Steps
See Notion tasks or implementation plan for detailed task breakdowns.
