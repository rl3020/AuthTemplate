# AuthTemplate

A starting point for Next.js apps that need Supabase auth. It gives you the wiring that's tedious to get right — server/browser/middleware Supabase clients, session refresh on every request, local Postgres via Docker, and a migration pipeline that deploys on merge — so you can start writing your actual app instead of your fifth auth setup.

**Tech stack**

- **Next.js 16** — App Router, TypeScript, Turbopack
- **React 19**
- **CSS Modules** — scoped component styles, no Tailwind
- **Supabase** — Postgres, auth, storage
- **Vercel** — deployment target

**What's already wired**

- Supabase clients for all three runtimes (`src/lib/supabase/`)
- Automatic session refresh via [src/proxy.ts](src/proxy.ts), applied to every non-static route
- Local Supabase on offset ports, so it won't collide with your other projects
- GitHub Actions workflow that pushes migrations to production on merge to `main`

**What's not**

There are no sign-in, sign-up, or password-reset pages yet — you get the session plumbing, not the UI. The pages under `src/app/` are placeholder marketing screens left over from the project this was forked from. Delete them and build your own.

---

## 0. Prerequisites

| Tool             | Version                           | Notes                                                                   |
| ---------------- | --------------------------------- | ----------------------------------------------------------------------- |
| **Node.js**      | 20.19+ (22 LTS or 24 recommended) | Node 20.17 works but emits an engine warning from ESLint's dependencies |
| **Docker**       | any recent                        | Must be _running_ — Supabase's local stack is containerized             |
| **Supabase CLI** | 2.x                               | `brew install supabase/tap/supabase`                                    |

Verify before you start:

```bash
node -v && docker info > /dev/null && supabase --version
```

---

## 1. Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Start the local Supabase stack

```bash
supabase start
```

First run pulls several GB of Docker images — expect a few minutes. When it finishes it prints your local credentials, including an **API URL** and a **Publishable key**. Keep that output around for the next step.

This project uses ports `54331–54337` instead of Supabase's defaults, configured in [supabase/config.toml](supabase/config.toml), so it can run alongside other local Supabase projects.

### 3. Create `.env.local`

At the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54331
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<paste the Publishable key from step 2>
```

`.env*` is gitignored — these never get committed.

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
supabase stop           # stops containers, keeps data
supabase stop --no-backup  # stops and wipes local data
```

---

## Supabase clients

Three helpers in `src/lib/supabase/`, one per runtime. Using the wrong one is the most common source of auth bugs, so pick deliberately:

| File                                    | Where it runs | Use in                                            |
| --------------------------------------- | ------------- | ------------------------------------------------- |
| [client.ts](src/lib/supabase/client.ts) | Browser       | Client Components (`"use client"`)                |
| [server.ts](src/lib/supabase/server.ts) | Server        | Server Components, Server Actions, Route Handlers |
| [proxy.ts](src/lib/supabase/proxy.ts)   | Middleware    | Session refresh only — not for queries            |

```ts
// Client Component — synchronous
const supabase = createClient();

// Server Component / Server Action — async, reads the cookie store
const supabase = await createClient();
```

> **Placement matters.** In Next 16, middleware is a file named `proxy.ts` that must sit beside your `app/` directory. Because this project uses `src/app/`, the file lives at `src/proxy.ts`. Put it at the repo root instead and Next compiles it but never runs it — no error, no warning, sessions just silently stop refreshing. Confirm it's active by looking for `ƒ Proxy (Middleware)` in `npm run build` output.

---

## Database migrations

Schema changes go through migration files. Don't edit the database directly through Studio — those changes won't reach production.

```bash
supabase migration new add_profiles_table   # creates supabase/migrations/<timestamp>_add_profiles_table.sql
# edit the generated file
supabase db reset                           # rebuilds local DB from every migration, in order
```

`supabase/migrations/` doesn't exist yet — your first `migration new` creates it.

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
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home
│   ├── landingPage/         # Placeholder marketing sections — replace these
│   ├── groomer-onboarding/  # Placeholder page — replace
│   └── request-pickup/      # Placeholder page — replace
├── components/icons/        # Shared icon components
├── lib/supabase/            # Client / server / proxy Supabase helpers
└── proxy.ts                 # Next 16 middleware — session refresh + route matcher
supabase/
└── config.toml              # Local stack config (offset ports 54331–54337)
.github/workflows/
└── migrate.yml              # Auto-deploy migrations on merge to main
```
