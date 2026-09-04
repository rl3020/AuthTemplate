# Setup checklist

Ships with the template, unchecked. Meant to be read and checked off by
your AI coding assistant while working through the copyable prompt on the
home page (paste the Free or Production version at
[auth-template.com](https://auth-template.com/#setup-prompt), or do it
yourself by hand) — a running record of where you are, so a fresh session
can resume without re-deriving or re-asking. Safe to delete once
everything's checked and you're done — step 9 does that for you.

## Trunk — same regardless of which path you pick

- [ ] **1. Get the code** — clone your own copy (the one you got from "Use this template" on GitHub, not the template repo itself).
- [ ] **2. Local setup** — `npm install`; confirm Docker is running (`docker info`); `npx supabase start` and note the local API URL + Publishable key it prints; copy `.env.example` → `.env.local` and fill those in (leave `NEXT_PUBLIC_SITE_URL` as `http://localhost:3000`); `npm run dev` and confirm `http://localhost:3000` loads.
- [ ] **3. Create a hosted Supabase project** — supabase.com/dashboard → New project. Set a DB password when prompted and write it down (Supabase won't show it again). Once it's provisioned, note the Project URL, Publishable key (Project Settings → API), and the project ref (the string in the dashboard URL, also under Project Settings → General).
- [ ] **4. Generate a Supabase access token** — dashboard → Account → Access Tokens, scoped to this project. Real secret, don't paste it anywhere but a secure prompt.
- [ ] **5. Add GitHub repository secrets** — `SUPABASE_ACCESS_TOKEN` (step 4), `SUPABASE_PROJECT_REF` (step 3), `SUPABASE_DB_PASSWORD` (step 3) at repo → Settings → Secrets and variables → Actions → New repository secret.
- [ ] **6. First migrations** — already in `supabase/migrations/`, nothing to write. Two ship: one creates `profiles` with RLS, the other grants `authenticated` actual table-level access to it (RLS alone doesn't grant that — a hosted project doesn't get the default grants local dev quietly has). Trigger via Actions tab → "Deploy Supabase Migrations" → Run workflow.
- [ ] **7. Deploy to Vercel** — `vercel login` → `vercel link` → `vercel env add NEXT_PUBLIC_SUPABASE_URL production` and the same for `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` → `vercel --prod`. Optional: custom domain under Vercel project → Settings → Domains (DNS records at your registrar, then wait for verification).

## Path — pick one

- [ ] **8a. Free** — nothing else to do. Sign-up, login, sessions, protected routes, and settings all work end to end. Forgot/reset password stays off — that's the whole point of this path, not a bug. Revisitable any time via 8b below.

- [ ] **8b. Production** — only if you want working forgot/reset password (and optionally email confirmation):
  - [ ] Resend (or any SMTP provider): create an account, verify a domain via DNS records at your registrar, generate an API key
  - [ ] Supabase → Authentication → Emails → SMTP Settings: host `smtp.resend.com`, **port `587`** (not 465 — hangs/times out connecting to Resend), username `resend`, password = the API key, sender email (any address on the verified domain, doesn't need a real inbox) + sender name (both required to save)
  - [ ] Supabase → Authentication → Rate Limits — raise the email limit off the shared-mailer default
  - [ ] `supabase/config.toml` — add a `[remotes.production]` block (with your project ref) overriding `site_url`/`additional_redirect_urls` to your real production URL — this is the literal value substituted into the email templates, not just a redirect allow-list entry
  - [ ] `.github/workflows/config.yml` — flip `SMTP_CONFIGURED` to `"true"`, commit, push
  - [ ] Actions tab → "Deploy Supabase Config" → Run workflow — confirm the "Push config" step succeeds (not skipped)
  - [ ] Test a real password reset against the *deployed* URL (not localhost) using an email that's genuinely registered (Authentication → Users) — the UI always shows "check your email" regardless, so check Resend's own dashboard (Emails → Sending) if nothing arrives
  - [ ] Optional: flip `enable_confirmations` to `true` in `supabase/config.toml`'s `[auth.email]` block if you also want signup email verification — separate opt-in, not automatic from SMTP, and (unlike `site_url`) affects local dev too since there's no per-environment override for it

## Finish

- [ ] **9. Clean up** — delete `src/app/(deleteWhenReady)/` (onboarding content, safe to remove — isolated route group, won't break `/auth/*`, `/settings`, or `src/lib/`), update the title/description in `src/app/layout.tsx`'s metadata, and delete this file.

## Notes

<!-- Fill in as you go: project ref, deployed URL, which path you picked,
     and anything else a fresh session would need to resume correctly
     without re-deriving or re-asking. -->
