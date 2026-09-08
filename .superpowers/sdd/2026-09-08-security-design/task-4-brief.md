# Task 4: Configure strict HTTP Security Headers

Context: Securing the Next.js application by providing security headers.
Read this first — it is your requirements, with the exact values to use verbatim.

Modify `next.config.ts` to include the following security headers:
- `X-DNS-Prefetch-Control` set to `on`
- `Strict-Transport-Security` set to `max-age=63072000; includeSubDomains; preload`
- `X-Frame-Options` set to `SAMEORIGIN`
- `X-Content-Type-Options` set to `nosniff`
- `Referrer-Policy` set to `origin-when-cross-origin`
- `Content-Security-Policy` set to `default-src 'self' https://*.supabase.co; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com; frame-src 'self' https://www.youtube.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;`

Make sure to preserve any existing `NextConfig` type definitions and configuration options if any, and export the config correctly.
TDD requirement: Next.js configs are an exception to TDD. No test is required for `next.config.ts`.
