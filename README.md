# AuthTemplate

## Quickstart

Requires [Docker](https://www.docker.com/) running. The [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started) is already a project dependency — `npm install` gets it, no separate/global install needed.

```bash
npm install
npx supabase start             # prints a Publishable key — copy it
cp .env.example .env.local      # paste the key into NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
npm run dev
```

Open **http://localhost:3000**. See [Prerequisites](#0-prerequisites) below for version details, or the full walkthrough at [Quick start](#1-quick-start).

---

A starting point for Next.js apps that need Supabase auth. It gives you the wiring that's tedious to get right — server/browser/middleware Supabase clients, session refresh on every request, local Postgres via Docker, and a migration pipeline that deploys on merge — so you can start writing your actual app instead of your fifth auth setup.

**Tech stack**

- **Next.js 16** — App Router, TypeScript, Turbopack
- **React 19**
- **CSS Modules** — scoped component styles, no Tailwind
- **Supabase** — Postgres, auth, storage
- **Vercel** — deployment target

**What's already wired**

- Email/password sign-up, login, sign-out, email confirmation, and password reset — call `signUp`, `signIn`, `signOut`, `requestPasswordReset`, `updatePassword` from `src/lib/auth/actions.ts` and the rest follows
- `getUser`/`requireUser` for reading the session in Server Components, `useUser` for reactive client-side access — see [Authentication](#authentication)
- `/auth/login`, `/auth/sign-up`, `/auth/forgot-password`, and `/auth/reset-password` pages, wired to those actions with pending state and error display out of the box
- A `profiles` table with Row Level Security already enabled and an `on_auth_user_created` trigger that inserts a row automatically on sign-up — see [supabase/migrations](supabase/migrations)
- An account settings page (`/settings`) for editing the display name, and a `/dashboard` example that reads it back and greets the user by name
- Supabase clients for all three runtimes (`src/lib/supabase/`)
- Default-deny session middleware ([src/lib/supabase/proxy.ts](src/lib/supabase/proxy.ts)) — every route requires a signed-in user except `/` and anything under `/auth/*`, so a new protected page needs nothing registered
- Local Supabase on offset ports, so it won't collide with your other projects
- A GitHub Actions workflow that pushes both database migrations and auth/email-template config to production on push to `main`
- A site-wide dark mode toggle, persisted to `localStorage` and falling back to the OS preference

**What's not**

There's no OAuth providers. Row Level Security is only as good as the policies you write — the `profiles` table above has a working example, but any new table you add needs its own policies; that's the boundary that actually matters, since client-side and Server Action checks can be bypassed but Postgres enforcing RLS can't.

The home page (`src/app/(deleteWhenReady)/page.tsx`) and everything else in that `(deleteWhenReady)` route group — the setup walkthrough, the file-tree overview, and the `/dashboard` example — is onboarding content, not your app. The parenthesized folder name keeps it out of the URL, so `/dashboard` still routes normally. Delete the whole `(deleteWhenReady)` folder once you're wired up and replace `src/app/(deleteWhenReady)/page.tsx` with your actual home page.

---

## 0. Prerequisites

**Local dev only needs the first two** — everything else is only required once you deploy to production.

| Tool                        | Version/Plan                      | Notes                                                                   |
| ---------------------------- | --------------------------------- | ------------------------------------------------------------------------ |
| **Node.js**                  | 20.19+ (22 LTS or 24 recommended) | Node 20.17 works but emits an engine warning from ESLint's dependencies |
| **Docker**                   | any recent                        | Must be _running_ — Supabase's local stack is containerized             |
| **Supabase account**         | Free tier works, with one caveat below | For your hosted project — [Create a Supabase project](#create-a-supabase-project) |
| **Vercel account**           | Free (Hobby) tier works           | Or any host that runs Next.js — see [Deploy to Vercel](#deploy-to-vercel) |
| **GitHub repo**               | —                                  | The migrations and config workflows ([.github/workflows/migrate.yml](.github/workflows/migrate.yml), [config.yml](.github/workflows/config.yml)) need repository secrets — see [Wire up GitHub Actions](#wire-up-github-actions) |
| **Custom SMTP provider**     | Only if you need forgot/reset password to work | See caveat below — everything else runs with zero email setup |
| **A domain you own**         | Only alongside SMTP               | SMTP providers only deliver to arbitrary recipients from a domain you've verified via DNS — their sandbox sender (e.g. Resend's `onboarding@resend.dev`) only sends to your own signup email, not real users |

> **Free-tier Supabase blocks custom email templates entirely — this only matters for forgot/reset password.** Sign-up and login work with zero email setup: `enable_confirmations = false` in [supabase/config.toml](supabase/config.toml) means no confirmation email is ever sent, so nothing here blocks you from shipping for free.
>
> Forgot/reset password is different — there's no way to reset a password without emailing *something*, and this template's recovery flow only works with its own custom `recovery.html` (the default Supabase template redirects with session tokens in a URL fragment that this app has no code to read — using it isn't just less secure, the flow is non-functional). Pushing that custom template to a free-tier project on Supabase's built-in mailer fails outright:
>
> ```
> unexpected status 400: {"message":"Email template modification is not available for free tier
> projects using the default email provider. Please upgrade your plan or configure a custom SMTP provider."}
> ```
>
> The config workflow ([.github/workflows/config.yml](.github/workflows/config.yml)) skips the template push by default via an `SMTP_CONFIGURED: "false"` flag committed at the top of that file — migrations (a separate workflow, [migrate.yml](.github/workflows/migrate.yml)) deploy independently either way, so this never blocks shipping. It does mean **forgot/reset password stays broken in production until you flip it on**: upgrade to Supabase Pro, or configure a custom SMTP provider (Resend's free tier — 3,000 emails/month — works fine and unblocks the push). The SMTP route also means owning a domain — providers only deliver to arbitrary recipients from a domain you've verified via DNS records. Set up SMTP under **Authentication → Emails → SMTP Settings**, then edit `SMTP_CONFIGURED` to `"true"` in `config.yml`, commit, and re-run that workflow — see [Configure a real SMTP provider before you launch](#deploy-to-vercel).

The Supabase CLI is a `devDependency` in [package.json](package.json), not a global install — `npm install` pulls a version pinned to this repo, and every command runs through `npx supabase ...` so you never need Homebrew, Scoop, or a standalone binary.

Verify before you start:

```bash
node -v && docker info > /dev/null && npx supabase --version
```

---

## 1. Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Start the local Supabase stack

```bash
npx supabase start
```

First run pulls several GB of Docker images — expect a few minutes. When it finishes it prints your local credentials, including an **API URL** and a **Publishable key**. Keep that output around for the next step.

This project uses ports `54331–54337` instead of Supabase's defaults, configured in [supabase/config.toml](supabase/config.toml), so it can run alongside other local Supabase projects.

### 3. Create `.env.local`

Copy the example file and fill in the Publishable key from step 2:

```bash
cp .env.example .env.local
```

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54331
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<paste the Publishable key from step 2>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`.env*` is gitignored (`.env.example` is the one exception) — real credentials never get committed.

### 4. Start the dev server

```bash
npm run dev
```

Open **http://localhost:3000**. Supabase Studio is at **http://localhost:54333**.

### Scripts

| Command         | Does                       |
| --------------- | -------------------------- |
| `npm run dev`   | Dev server with hot reload |
| `npm run build` | Production build           |
| `npm start`     | Serve the production build |
| `npm run lint`  | ESLint                     |

### Stopping

```bash
npx supabase stop           # stops containers, keeps data
npx supabase stop --no-backup  # stops and wipes local data
```

---

## Authentication

The API is seven functions across two files. Which one you want depends on where your code runs and whether it needs client-side pending/error state:

| Function                                                    | File                                                | Runs on | Use for                                                        |
| ------------------------------------------------------------ | ---------------------------------------------------- | ------- | ---------------------------------------------------------------- |
| `signUp`, `signIn`, `requestPasswordReset`, `updatePassword` | [src/lib/auth/actions.ts](src/lib/auth/actions.ts) | Server  | Form submissions — plug into `useActionState`                    |
| `signOut`, `confirmEmail`                                    | [src/lib/auth/actions.ts](src/lib/auth/actions.ts) | Server  | Form actions with no client state needed                         |
| `getUser`, `requireUser`                                     | [src/lib/auth/session.ts](src/lib/auth/session.ts) | Server  | Server Components — read the user / gate a page                  |
| `useUser`                                                    | [src/lib/auth/useUser.ts](src/lib/auth/useUser.ts) | Client  | `"use client"` components that need live auth state (not a security check) |

Everything else (forms, redirects, pending states, error messages, session cookies, the confirmation and recovery email links) is already wired to these.

### Adding a form that uses them

`signUp`, `signIn`, `requestPasswordReset`, and `updatePassword` are built to plug straight into React 19's `useActionState`, which gives you pending state and the last error for free:

```tsx
"use client";
import { useActionState } from "react";
import { signIn } from "@/lib/auth/actions";
import { initialAuthActionState } from "@/lib/auth/types";

function MyLoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialAuthActionState);
  return (
    <form action={formAction}>
      {state.error && <p>{state.error}</p>}
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
```

`signOut` and `confirmEmail` take no client state — call them directly as a form action: `<form action={signOut}><button>Sign out</button></form>`.

[src/app/auth/login/LoginForm.tsx](src/app/auth/login/LoginForm.tsx), [src/app/auth/sign-up/SignUpForm.tsx](src/app/auth/sign-up/SignUpForm.tsx), [src/app/auth/forgot-password/ForgotPasswordForm.tsx](src/app/auth/forgot-password/ForgotPasswordForm.tsx), and [src/app/auth/reset-password/ResetPasswordForm.tsx](src/app/auth/reset-password/ResetPasswordForm.tsx) are the working versions of the snippet above — copy the pattern for any new auth form.

### What happens on sign-up

`signUp` calls Supabase, then branches on whether a session came back:

- **Email confirmations off** (the local dev default — `enable_confirmations = false` in [supabase/config.toml](supabase/config.toml)) — Supabase returns a session immediately, so the user is already logged in. Redirects straight to `/dashboard`.
- **Email confirmations on** (typical in production) — no session yet. Redirects to `/auth/sign-up/check-email`. The confirmation link points at [src/app/auth/(email-links)/confirm/page.tsx](src/app/auth/(email-links)/confirm/page.tsx), a landing page that requires an actual click before verifying — the click submits a form to the `confirmEmail` Server Action, which calls `verifyOtp` and redirects to `/dashboard`. It's deliberately not verified on page load (a GET): mail scanners (Microsoft Defender, Proofpoint, etc.) prefetch every link in an email, and a GET-triggered confirmation would get silently consumed by a bot before the user ever opens the message.

The confirmation link is built from `NEXT_PUBLIC_SITE_URL` if set (see `.env.example`), otherwise it falls back to Vercel's own `VERCEL_PROJECT_PRODUCTION_URL`/`VERCEL_URL` — see [src/lib/site.ts](src/lib/site.ts). You only need to set it yourself for a custom domain or a non-Vercel host.

**Don't just add your production URL in the Supabase dashboard.** `supabase/config.toml` is what actually stays in sync — the migration workflow runs `supabase config push` on every push to `main` that touches `supabase/`, which overwrites the dashboard's `site_url`/redirect URLs back to whatever's in that file. Editing the dashboard directly works until the next migration push silently resets it.

`site_url` matters more than it looks — it's not just a redirect allow-list entry, it's the literal value Supabase substitutes into `{{ .SiteURL }}` in the email templates (`supabase/templates/confirmation.html`/`recovery.html`). Leave it as `http://localhost:3000` in the base `[auth]` block (that's what local dev needs), and instead add a **`[remotes.<name>]` override** at the bottom of `config.toml` — this is what actually gets your production emails linking to your real domain instead of `localhost`:

```toml
[remotes.production]
project_id = "your-project-ref"   # from your Supabase project's dashboard URL — not a secret

[remotes.production.auth]
site_url = "https://your-app.com"
additional_redirect_urls = ["https://your-app.com", "https://your-app.com/auth/confirm"]
```

`supabase config push` merges the matching `[remotes.<name>]` block on top of the base config only when pushing to that project ref — so local dev and production each get the right `site_url` automatically, no manual toggling. **You'll need to replace `project_id` and the URLs above with your own** — this template ships with its own author's values, which won't match your project. A project ref isn't sensitive (it's already public in your `NEXT_PUBLIC_SUPABASE_URL`), so it's fine to commit.

**Before you rely on confirmation emails in production**, know that Supabase's built-in mailer is rate-limited project-wide (a couple of emails per hour, regardless of recipient) — fine for local testing, not for real signups. It also flatly refuses to push custom email templates on the free tier — see the [Prerequisites](#0-prerequisites) caveat, since that's exactly what breaks this template's confirmation-link fix. Fix both under **Authentication → Emails → SMTP Settings** with your own provider, then raise the limit under **Authentication → Rate Limits**. See [Supabase's SMTP docs](https://supabase.com/docs/guides/auth/auth-smtp).

Setting up Resend specifically, end to end:
1. Create an account, then **Domains → Add Domain**. This can be a different domain than wherever the app is hosted.
2. Add the TXT/CNAME records Resend shows you at your domain registrar's DNS settings (GoDaddy, Namecheap, Cloudflare, etc.), then wait for Resend to show the domain as **Verified** — usually minutes, sometimes longer while DNS propagates. Sending fails until it flips.
3. **API Keys → Create API Key** — that's your SMTP password.
4. In Supabase's SMTP Settings: Host `smtp.resend.com`, **Port `587`** (not `465` — Supabase's mailer can hang and time out connecting to Resend on `465`; `587` is the one that actually works), Username `resend` (literally that word), Password the API key from step 3. Sender email is any address on your verified domain (e.g. `noreply@yourdomain.com`) — it doesn't need to be a real inbox, it's just the `From` header. Sender name is any display name. Both Sender email and Sender name are required — the form won't save without them.

**Testing it:** always test against your deployed URL, not `localhost` — local dev talks to your local Supabase stack (Mailpit), which is unaffected by any of this. `requestPasswordReset` (and Supabase's `/recover` endpoint underneath it) always shows a "check your email" success response whether or not the account exists, by design, to stop attackers enumerating registered emails — so a successful-looking response doesn't confirm anything actually sent. Use an email that's genuinely registered on the hosted project (**Authentication → Users**), and if nothing arrives, check Resend's own dashboard (**Emails → Sending**) to see whether it even received a send request from Supabase — that tells you which side of the pipe the problem is on before you go looking further.

**Email confirmation is a separate opt-in from SMTP** — setting up delivery doesn't flip `enable_confirmations` for you, it stays `false` in `supabase/config.toml`'s `[auth.email]` block until you change it yourself. Worth turning on once delivery actually works: it verifies someone owns the email before their account is fully usable, and the click-gated `/auth/confirm` page plus the custom template only actually close the mail-scanner vulnerability once real delivery exists behind them — leaving it off doesn't add safety, it just skips verification. It's a judgment call either way; sign-up works fine with it off too. One thing worth knowing: unlike `site_url`, there's no `[remotes.<name>]` override for it, so flipping it affects local dev too, not just production.

### What happens on forgot/reset password

`requestPasswordReset` always redirects to `/auth/forgot-password/check-email`, whether or not the address has an account — revealing that would let someone enumerate registered emails. If it does have an account, Supabase emails a recovery link that also points at `/auth/confirm`, with `type=recovery`; clicking it calls `confirmEmail`, which verifies the token, signs the user in, and redirects to `/auth/reset-password`. That page is only reachable with an active session — no session means the link was invalid or expired. From there, `updatePassword` sets the new password and redirects to `/dashboard`.

### Routing

| Route                              | What                                                                 |
| ------------------------------------ | ----------------------------------------------------------------------- |
| `/auth/login`                       | Sign-in form                                                             |
| `/auth/sign-up`                     | Sign-up form                                                             |
| `/auth/sign-up/check-email`         | Shown after sign-up when confirmation is required                        |
| `/auth/forgot-password`             | Request a password reset link                                            |
| `/auth/forgot-password/check-email` | Shown after every reset request, regardless of whether the email exists  |
| `/auth/reset-password`              | Set a new password — only reachable with the session the recovery link creates |
| `/auth/confirm`                     | Click-through landing page for both the confirmation and recovery links  |
| `/auth/error`                       | Generic auth error page                                                  |
| `/dashboard`                        | Example protected page — shows the signed-in user, links to Settings     |
| `/settings`                         | Account settings — edit display name                                     |

### Reading the current user — server side

`getUser()` and `requireUser()` in [src/lib/auth/session.ts](src/lib/auth/session.ts) are for Server Components. `getUser()` returns the user or `null`; `requireUser()` calls it and redirects to `/auth/login` if there isn't one:

```tsx
import { requireUser } from "@/lib/auth/session";

export default async function DashboardPage() {
  const user = await requireUser(); // redirects to /auth/login if signed out
  return <p>Signed in as {user.email}</p>;
}
```

`getUser()` is wrapped in React's `cache()`, so if a layout and a page both call it during the same request, Supabase's Auth server is only hit once — not because the result is cached across requests (it isn't; the session is re-verified every time), but because it's deduped within a single render pass.

This is the check that actually matters. The proxy's redirect (below) is a UX nicety only — see the warning further down for why a Server Action can bypass it.

### Reading the current user — client side

`useUser()` in [src/lib/auth/useUser.ts](src/lib/auth/useUser.ts) is for `"use client"` components that want to react live to auth changes — a header badge that updates the instant someone signs out, including in another browser tab — without being handed the user as a prop:

```tsx
"use client";
import { useUser } from "@/lib/auth/useUser";

export function HeaderBadge() {
  const { user, loading } = useUser();
  if (loading) return null;
  return user ? <span>{user.email}</span> : <Link href="/auth/login">Sign in</Link>;
}
```

**This is not a security check.** It's local browser state driven by Supabase's client-side auth listener — it can tell your UI what to show, but it must never be the thing that decides whether a Server Action or a page render is allowed. That's always `requireUser()` plus Row Level Security.

### Protecting a new route

Every route requires a signed-in user by default — [src/lib/supabase/proxy.ts](src/lib/supabase/proxy.ts) only allow-lists `"/"` and anything under `/auth/*` as public. Add a page anywhere else and the proxy already redirects signed-out visitors to `/auth/login` before it renders; there's nothing to register for a new protected route.

That redirect is still a UX convenience, not the security boundary — see the warning below for why a Server Action can bypass it. Call `requireUser()` at the top of the page itself, as `/dashboard` and `/settings` do. That's the check that can't be bypassed.

---

## Supabase clients

Three helpers in `src/lib/supabase/`, one per runtime. Using the wrong one is the most common source of auth bugs, so pick deliberately:

| File                                    | Where it runs | Use in                                               |
| ---------------------------------------- | -------------- | ----------------------------------------------------- |
| [client.ts](src/lib/supabase/client.ts) | Browser        | Client Components (`"use client"`)                     |
| [server.ts](src/lib/supabase/server.ts) | Server         | Server Components, Server Actions, Route Handlers      |
| [proxy.ts](src/lib/supabase/proxy.ts)   | Middleware     | Session refresh + route redirects — not for queries    |

```ts
// Client Component — synchronous
const supabase = createClient();

// Server Component / Server Action — async, reads the cookie store
const supabase = await createClient();
```

> **Placement matters.** In Next 16, middleware is a file named `proxy.ts` that must sit beside your `app/` directory. Because this project uses `src/app/`, the file lives at `src/proxy.ts`. Put it at the repo root instead and Next compiles it but never runs it — no error, no warning, sessions just silently stop refreshing. Confirm it's active by looking for `ƒ Proxy (Middleware)` in `npm run build` output.

> **The proxy is not your security boundary.** A Server Action isn't its own route — it's a POST back to whatever page called it, identified only by a `next-action` header, which [src/proxy.ts](src/proxy.ts)'s broad matcher can't see; it only sees the path. Any Server Action reachable from a public page (`/` or anything under `/auth/*`) runs without the proxy's redirect ever kicking in — no error, no failing build. [dashboard/page.tsx](src/app/(deleteWhenReady)/dashboard/page.tsx) shows the pattern to follow: re-check `getUser()` inside the protected page itself, and do the same inside any Server Action that touches private data. Then put Row Level Security on every table, so Postgres refuses the query even if every check above it is wrong.

---

## Database migrations

Schema changes go through migration files. Don't edit the database directly through Studio — those changes won't reach production.

```bash
npx supabase migration new add_posts_table   # creates supabase/migrations/<timestamp>_add_posts_table.sql
# edit the generated file
npx supabase db reset                        # rebuilds local DB from every migration, in order
```

Two migrations ship already: [20260830005405_init.sql](supabase/migrations/20260830005405_init.sql) creates `profiles` with RLS and the auto-create trigger mentioned above, and [20260904034640_grant_profiles_access.sql](supabase/migrations/20260904034640_grant_profiles_access.sql) grants `authenticated` actual table-level access to it.

**That second one matters more than it looks.** RLS only filters *rows* once a role already has table-level privilege — it doesn't grant that privilege itself. `supabase start`/`db reset` locally bootstraps default grants for you as part of Supabase's local template, so this is easy to never think about. A hosted project doesn't get the same default grants for tables created by a migration (only ones created through Studio's Table Editor do), so without an explicit `grant`, every fresh hosted project would hit `permission denied for table profiles` the moment anything touches it — while local dev looks completely fine. **Use both files as the pattern for any table you add**: enable RLS, add policies, *and* grant `select`/`insert`/`update`/`delete` to `authenticated` explicitly — `db reset` won't catch a missing grant, only a real deploy will.

---

## Deployment

### Vercel

Set these in **Project → Settings → Environment Variables**, using values from **Supabase dashboard → Project → Settings → API**:

```
NEXT_PUBLIC_SUPABASE_URL             = https://<your-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = <your production publishable key>
```

`NEXT_PUBLIC_SITE_URL` is optional here — see [What happens on sign-up](#what-happens-on-sign-up) above. Only set it if you're using a custom domain or deploying somewhere other than Vercel.

### Deploy CI

Two independent workflows, so migrations and config each get their own status check and can be re-run separately:

| Workflow | Triggers on | Does |
| --- | --- | --- |
| [.github/workflows/migrate.yml](.github/workflows/migrate.yml) — "Deploy Supabase Migrations" | `supabase/migrations/**` | `supabase db push` — applies pending migrations |
| [.github/workflows/config.yml](.github/workflows/config.yml) — "Deploy Supabase Config" | `supabase/config.toml`, `supabase/templates/**` | `supabase config push` — syncs auth settings and the confirmation/recovery email templates, including `additional_redirect_urls` |

Both need the same three repository secrets:

| Secret                  | Where to find it                         |
| ----------------------- | ---------------------------------------- |
| `SUPABASE_ACCESS_TOKEN` | supabase.com → Account → Access Tokens   |
| `SUPABASE_PROJECT_REF`  | supabase.com/dashboard/project/**[ref]** |
| `SUPABASE_DB_PASSWORD`  | Dashboard → Project Settings → Database  |

Until those secrets are set, both workflows fail harmlessly — they have no project to connect to.

**The config workflow only actually pushes once you've set up custom SMTP.** It's gated behind an `SMTP_CONFIGURED: "false"` flag committed at the top of `config.yml` — free-tier Supabase rejects `config push`'s email template changes outright (`Email template modification is not available for free tier projects using the default email provider`), so rather than let that fail the job on every push, the push step is cleanly *skipped* (a warning, not a failure) until you flip the flag to `"true"`. The migrations workflow is entirely separate and always runs regardless — it isn't gated by this at all. See the [Prerequisites](#0-prerequisites) caveat and [What happens on sign-up](#what-happens-on-sign-up) above for the full SMTP setup (Resend, port gotchas, `site_url`, testing). Once SMTP is configured and the flag is flipped, trigger it via the repo's Actions tab → "Deploy Supabase Config" → **Run workflow** (a manual `workflow_dispatch` trigger, no new commit needed).

---

## Project structure

`SETUP_CHECKLIST.md` at the repo root isn't shown below — it ships unchecked, tracks the whole setup flow (same steps as the AI prompt on the home page), and is meant to be checked off and committed as you go, then deleted once you're done (see its own "Clean up" step).

```
src/
├── app/
│   ├── layout.tsx                # Root layout — mounts the navbar (ThemeToggle) and the pre-hydration theme script
│   ├── layout.module.css         # Styles the navbar
│   ├── globals.css               # Reset + shared color/spacing tokens (light + dark)
│   ├── favicon.ico
│   ├── components/                # App-wide reusable UI, not tied to one route
│   │   ├── ThemeToggle.tsx        #   Dark mode toggle, shown on every page
│   │   ├── ThemeToggle.module.css
│   │   ├── AuthToggle.tsx         #   Sign in / sign up tab switcher on the home page
│   │   ├── InlineScript.tsx       #   Helper for the pre-hydration theme-init script
│   │   └── app.module.css         #   Shared form/button/card/tab styles (auth + settings + onboarding)
│   ├── (deleteWhenReady)/         # Onboarding content only — delete this whole folder
│   │   ├── page.tsx                #   Home page ("/") — replace with your actual app
│   │   ├── WhatsIncluded.tsx       #   "What's included" section — Free vs. Production table
│   │   ├── FeatureCompareTable.tsx #   The Free vs. Production table itself
│   │   ├── RepoFileStructure.tsx   #   "Repo file structure" section
│   │   ├── FileTree.tsx            #   The clickable file-tree overview itself
│   │   ├── SetupGuide.tsx          #   Step-by-step setup walkthrough
│   │   ├── SetupPrompt.tsx         #   Copyable "set up with your AI assistant" prompt
│   │   ├── TrackCard.tsx           #   Renders each Free/Production card in the guide's fork
│   │   ├── TrackCard.module.css
│   │   ├── CodePanel.tsx           #   Copyable terminal panel used by the guide/prompt
│   │   ├── page.module.css
│   │   └── dashboard/page.tsx      #   Example protected page → "/dashboard"
│   ├── auth/                      # Every auth route and its shared UI
│   │   ├── auth.module.css         #   Auth-specific styles (AuthCard, etc.)
│   │   ├── components/
│   │   │   ├── AuthCard.tsx         #   Shell every auth page renders inside
│   │   │   ├── EmailField.tsx
│   │   │   ├── PasswordField.tsx    #   Password input with a show/hide toggle
│   │   │   ├── PasswordField.module.css
│   │   │   └── SubmitButton.tsx
│   │   ├── login/
│   │   │   ├── page.tsx              #   "/auth/login"
│   │   │   └── LoginForm.tsx         #   useActionState + signIn
│   │   ├── sign-up/
│   │   │   ├── page.tsx              #   "/auth/sign-up"
│   │   │   ├── SignUpForm.tsx        #   useActionState + signUp
│   │   │   └── check-email/page.tsx  #   Shown when confirmation is required
│   │   ├── forgot-password/
│   │   │   ├── page.tsx              #   "/auth/forgot-password"
│   │   │   ├── ForgotPasswordForm.tsx
│   │   │   └── check-email/page.tsx
│   │   ├── reset-password/
│   │   │   ├── page.tsx              #   "/auth/reset-password"
│   │   │   └── ResetPasswordForm.tsx
│   │   └── (email-links)/            #   Route group — landing pages for email links, not primary nav
│   │       ├── confirm/page.tsx      #   Click-through page for confirmation + recovery links, still "/auth/confirm"
│   │       └── error/page.tsx        #   Generic auth error page, still "/auth/error"
│   └── settings/
│       ├── page.tsx                 #   "/settings" — real, non-deletable protected page
│       └── DisplayNameForm.tsx
├── lib/
│   ├── auth/
│   │   ├── actions.ts          # signUp, signIn, signOut, requestPasswordReset, updatePassword, confirmEmail
│   │   ├── session.ts          # getUser, requireUser (Server Components)
│   │   ├── useUser.ts          # useUser (Client Components, reactive)
│   │   └── types.ts            # AuthActionState, initialAuthActionState
│   ├── profile/
│   │   └── queries.ts          # getProfile(userId) — cache()-wrapped read side
│   ├── settings/
│   │   ├── actions.ts          # updateDisplayName
│   │   └── types.ts
│   ├── site.ts                 # getSiteUrl() — NEXT_PUBLIC_SITE_URL, with a Vercel auto-detect fallback
│   └── supabase/                # Client / server / proxy Supabase helpers
└── proxy.ts                    # Next 16 middleware entry — session refresh + default-deny route gating
supabase/
├── config.toml                 # Local stack config (offset ports 54331–54337); auth settings + email templates pushed to production
├── templates/                  # confirmation.html, recovery.html — routed through /auth/confirm, not Supabase's default auto-verify-on-GET links
└── migrations/
    ├── 20260830005405_init.sql              # profiles table, RLS policies, auto-create trigger
    └── 20260904034640_grant_profiles_access.sql # authenticated table-level grants — RLS alone isn't enough
.github/workflows/
├── migrate.yml                 # Pushes supabase/migrations/** to production
└── config.yml                  # Pushes supabase/config.toml + templates/** to production (gated by SMTP_CONFIGURED)
```
