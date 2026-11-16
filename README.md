# JurisPilot

AI workspace for legal teams: Assistant, Vault, Workflows (contract review, clause extraction, summary, draft memo), Matters, usage limits and Selar-based billing. Next.js 16, TypeScript, Tailwind 4, Supabase, Gemini.

## Setup
1. `npm install`
2. Create a Supabase project and run `supabase/schema.sql` in the SQL editor (tables, RLS, signup trigger, private `vault` bucket).
3. In Supabase Auth settings add `http://localhost:3000/auth/callback` and your production URL + `/auth/callback` as redirect URLs.
4. Copy `.env.example` to `.env.local` and fill it in.
5. `npm run dev`

## Payments (Selar)
Plans: Professional $57, Firm $97 (links in `.env.example`). Users are **never** upgraded by returning from checkout. Add a Selar webhook pointing to
`https://YOUR_DOMAIN/api/webhooks/selar?token=SELAR_WEBHOOK_SECRET`. The webhook matches the buyer email to a JurisPilot account and sets the plan from the amount paid (57 or 97). Payloads are stored in `payment_events`. Check Selar's actual payload field names against `src/app/api/webhooks/selar/route.ts` and adjust if needed. Until the webhook is configured, an admin can activate a plan manually by updating `profiles` with the service role.

## Deploy to Vercel
Import the repo, set every variable from `.env.example` (server-only: `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, `SELAR_WEBHOOK_SECRET`), set `NEXT_PUBLIC_SITE_URL`, deploy.

## Limits (set in `src/lib/plans.ts`)
Starter 15 actions / 5 docs; Professional 400 / 100; Firm 2000 / 1000.
