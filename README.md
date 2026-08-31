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

- Email/password sign-up, login, sign-out, and email confirmation — call `signUp`, `signIn`, `signOut` from `src/lib/auth/actions.ts` and the rest follows
- `getUser`/`requireUser` for reading the session in Server Components, `useUser` for reactive client-side access — see [Authentication](#authentication)
- `/login` and `/sign-up` pages, wired to those actions with pending state and error display out of the box
- A `profiles` table with Row Level Security already enabled and an `on_auth_user_created` trigger that inserts a row automatically on sign-up — see [supabase/migrations](supabase/migrations)
- A `/dashboard` route as a working example of a protected page
- Supabase clients for all three runtimes (`src/lib/supabase/`)
- Automatic session refresh via [src/proxy.ts](src/proxy.ts), which also redirects signed-out visitors away from protected routes and signed-in visitors away from `/login` and `/sign-up`
- Local Supabase on offset ports, so it won't collide with your other projects
- GitHub Actions workflow that pushes migrations to production on merge to `main`
- A site-wide dark mode toggle (top-right of every page), persisted to `localStorage` and falling back to the OS preference

**What's not**

There's no password reset flow and no OAuth providers. Row Level Security is only as good as the policies you write — the `profiles` table above has a working example, but any new table you add needs its own policies; that's the boundary that actually matters, since client-side and Server Action checks can be bypassed but Postgres enforcing RLS can't.

The home page (`src/app/(deleteWhenReady)/page.tsx`) and everything else in that `(deleteWhenReady)` route group — the setup walkthrough, the file-tree overview, and the `/dashboard` example — is onboarding content, not your app. The parenthesized folder name keeps it out of the URL, so `/dashboard` still routes normally. Delete the whole `(deleteWhenReady)` folder once you're wired up and replace `src/app/(deleteWhenReady)/page.tsx` with your actual home page.

---

## 0. Prerequisites

| Tool         | Version                           | Notes                                                                   |
| ------------ | --------------------------------- | ------------------------------------------------------------------------ |
| **Node.js**  | 20.19+ (22 LTS or 24 recommended) | Node 20.17 works but emits an engine warning from ESLint's dependencies |
| **Docker**   | any recent                        | Must be _running_ — Supabase's local stack is containerized             |

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

The API is five functions across three files. Which one you want depends on where your code runs:

| Function                | File                                                | Runs on | Use for                                                        |
| ------------------------ | ---------------------------------------------------- | ------- | ---------------------------------------------------------------- |
| `signUp`, `signIn`      | [src/lib/auth/actions.ts](src/lib/auth/actions.ts) | Server  | Form submissions — plug into `useActionState`                    |
| `signOut`               | [src/lib/auth/actions.ts](src/lib/auth/actions.ts) | Server  | Any form action, no client state needed                          |
| `getUser`, `requireUser`| [src/lib/auth/session.ts](src/lib/auth/session.ts) | Server  | Server Components — read the user / gate a page                  |
| `useUser`               | [src/lib/auth/useUser.ts](src/lib/auth/useUser.ts) | Client  | `"use client"` components that need live auth state (not a security check) |

Everything else (forms, redirects, pending states, error messages, session cookies, the confirmation email link) is already wired to `signUp`/`signIn`/`signOut`.

### Adding a form that uses them

`signUp` and `signIn` are built to plug straight into React 19's `useActionState`, which gives you pending state and the last error for free:

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

`signOut` takes no input and never needs client state — call it directly as a form action: `<form action={signOut}><button>Sign out</button></form>`.

[src/app/login/LoginForm.tsx](src/app/login/LoginForm.tsx) and [src/app/sign-up/SignUpForm.tsx](src/app/sign-up/SignUpForm.tsx) are the working versions of the snippet above — copy the pattern for any new auth form (password reset, an invite flow, etc.).

### What happens on sign-up

`signUp` calls Supabase, then branches on whether a session came back:

- **Email confirmations off** (the local dev default — `enable_confirmations = false` in [supabase/config.toml](supabase/config.toml)) — Supabase returns a session immediately, so the user is already logged in. Redirects straight to `/dashboard`.
- **Email confirmations on** (typical in production) — no session yet. Redirects to `/sign-up/check-email`. The confirmation link points at [src/app/auth/confirm/route.ts](src/app/auth/confirm/route.ts), which verifies the token and redirects to `/dashboard`.

The confirmation link is built from `NEXT_PUBLIC_SITE_URL` (see `.env.example`) — set it to your real domain in production, and add that domain to **Supabase dashboard → Authentication → URL Configuration → Redirect URLs**, or the link will be rejected.

**Before you rely on confirmation emails in production**, know that Supabase's built-in mailer is rate-limited project-wide (a couple of emails per hour, regardless of recipient) — fine for local testing, not for real signups. Fix it under **Authentication → Emails → SMTP Settings** with your own provider (Resend, SendGrid, Postmark), then raise the limit under **Authentication → Rate Limits**. See [Supabase's SMTP docs](https://supabase.com/docs/guides/auth/auth-smtp).

### Routing

| Route                  | What                                                             |
| ----------------------- | ----------------------------------------------------------------- |
| `/login`                | Sign-in form                                                       |
| `/sign-up`              | Sign-up form                                                       |
| `/sign-up/check-email`  | Shown after sign-up when confirmation is required                  |
| `/auth/confirm`         | Route Handler — verifies the emailed confirmation token             |
| `/auth/error`           | Generic auth error page                                            |
| `/dashboard`            | Example protected page — shows the signed-in user, has sign-out     |

### Reading the current user — server side

`getUser()` and `requireUser()` in [src/lib/auth/session.ts](src/lib/auth/session.ts) are for Server Components. `getUser()` returns the user or `null`; `requireUser()` calls it and redirects to `/login` if there isn't one:

```tsx
import { requireUser } from "@/lib/auth/session";

export default async function DashboardPage() {
  const user = await requireUser(); // redirects to /login if signed out
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
  return user ? <span>{user.email}</span> : <Link href="/login">Sign in</Link>;
}
```

**This is not a security check.** It's local browser state driven by Supabase's client-side auth listener — it can tell your UI what to show, but it must never be the thing that decides whether a Server Action or a page render is allowed. That's always `requireUser()` plus Row Level Security.

### Protecting a new route

Two steps, and they serve different purposes — do both:

1. Add its prefix to `PROTECTED_PREFIXES` in [src/lib/supabase/proxy.ts](src/lib/supabase/proxy.ts) so signed-out visitors get redirected to `/login` before the page even renders. **This is a UX convenience, not the security boundary** — see the warning below.
2. Call `requireUser()` at the top of the page itself, as `/dashboard` does. This is the check that can't be bypassed.

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

> **The proxy is not your security boundary.** A Server Action isn't its own route — it's a POST back to whatever page called it, identified only by a `next-action` header. The proxy's matcher can't see that header; it only sees the path. Exclude a path from the matcher (or move a form to a page outside `PROTECTED_PREFIXES`) and any Server Action reachable from it loses its guard silently — no error, no failing build. [dashboard/page.tsx](src/app/(deleteWhenReady)/dashboard/page.tsx) shows the pattern to follow: re-check `getUser()` inside the protected page itself, and do the same inside any Server Action that touches private data. Then put Row Level Security on every table, so Postgres refuses the query even if every check above it is wrong.

---

## Database migrations

Schema changes go through migration files. Don't edit the database directly through Studio — those changes won't reach production.

```bash
npx supabase migration new add_posts_table   # creates supabase/migrations/<timestamp>_add_posts_table.sql
# edit the generated file
npx supabase db reset                        # rebuilds local DB from every migration, in order
```

[supabase/migrations/20260830005405_init.sql](supabase/migrations/20260830005405_init.sql) is the one migration already here — it creates `profiles` with RLS and the auto-create trigger mentioned above. Use it as the pattern (enable RLS, add policies) for any table you add.

---

## Deployment

### Vercel

Set these in **Project → Settings → Environment Variables**, using values from **Supabase dashboard → Project → Settings → API**:

```
NEXT_PUBLIC_SUPABASE_URL             = https://<your-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = <your production publishable key>
```

### Migration CI

[.github/workflows/migrate.yml](.github/workflows/migrate.yml) runs `supabase db push` on every push to `main` that touches `supabase/migrations/**`. It needs three repository secrets:

| Secret                  | Where to find it                         |
| ----------------------- | ---------------------------------------- |
| `SUPABASE_ACCESS_TOKEN` | supabase.com → Account → Access Tokens   |
| `SUPABASE_PROJECT_REF`  | supabase.com/dashboard/project/**[ref]** |
| `SUPABASE_DB_PASSWORD`  | Dashboard → Project Settings → Database  |

Until those secrets are set the workflow fails harmlessly — it has no project to connect to.

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout — mounts ThemeToggle, theme-init script
│   ├── globals.css             # Reset + shared color/spacing tokens (light + dark)
│   ├── ThemeToggle.tsx         # Dark mode toggle, shown on every page
│   ├── ThemeToggle.module.css
│   ├── AuthToggle.tsx          # Sign in / sign up tab switcher
│   ├── (deleteWhenReady)/      # Onboarding content only — delete this whole folder
│   │   ├── page.tsx            #   Home page ("/") — replace with your actual app
│   │   ├── WhatsIncluded.tsx   #   "What's included" file-tree overview
│   │   ├── SetupGuide.tsx      #   Step-by-step setup walkthrough
│   │   ├── CodePanel.tsx       #   Copyable terminal panel used by the guide
│   │   ├── page.module.css
│   │   └── dashboard/page.tsx  #   Example protected page → "/dashboard"
│   ├── login/
│   │   ├── page.tsx            # Sign-in page
│   │   └── LoginForm.tsx       # useActionState + signIn
│   ├── sign-up/
│   │   ├── page.tsx            # Sign-up page
│   │   ├── SignUpForm.tsx      # useActionState + signUp
│   │   └── check-email/        # Shown when confirmation is required
│   └── auth/
│       ├── confirm/route.ts    # Verifies the emailed confirmation token
│       ├── error/page.tsx      # Generic auth error page
│       └── auth.module.css     # Shared styles for the auth pages
├── lib/
│   ├── auth/
│   │   ├── actions.ts          # signUp, signIn, signOut (Server Actions)
│   │   ├── session.ts          # getUser, requireUser (Server Components)
│   │   ├── useUser.ts          # useUser (Client Components, reactive)
│   │   └── types.ts            # AuthActionState, initialAuthActionState
│   ├── site.ts                 # NEXT_PUBLIC_SITE_URL helper
│   └── supabase/                # Client / server / proxy Supabase helpers
└── proxy.ts                    # Next 16 middleware — session refresh + route gating
supabase/
├── config.toml                 # Local stack config (offset ports 54331–54337)
└── migrations/
    └── 20260830005405_init.sql # profiles table, RLS policies, auto-create trigger
.github/workflows/
└── migrate.yml                 # Auto-deploy migrations on merge to main
```
