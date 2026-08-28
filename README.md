# Zoomies

Dog transportation service that picks up dogs from their homes and takes them to grooming appointments, daycare, and other pet care destinations.

## Tech Stack

- **Next.js 16** — App Router, TypeScript
- **CSS Modules** — scoped component styling, no Tailwind
- **Supabase** — database, auth, storage
- **Vercel** — deployment

---

## Local Development

### Prerequisites

- Node.js
- Docker (for Supabase local)
- Supabase CLI

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file at the project root:

```bash
# Local Supabase (run `supabase start` to get these values)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54331
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_local_publishable_key
```

### 3. Start Supabase locally

```bash
supabase start
```

This project runs on offset ports (`54331–54337`) to avoid conflicts with other local Supabase projects. Ports are configured in `supabase/config.toml`.

Once running, copy the `Publishable` key from the output into `.env.local`.

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Supabase Client

Three client helpers live in `src/lib/supabase/`:

| File | Use |
|---|---|
| `client.ts` | Browser — use in Client Components (`"use client"`) |
| `server.ts` | Server — use in Server Components, Server Actions, Route Handlers |
| `proxy.ts` | Middleware utility — handles session refresh |

```ts
// Client Component
const supabase = createClient()

// Server Component / Server Action
const supabase = await createClient()
```

---

## Database Migrations

All schema changes go through migration files — never edit the database directly.

### Create a migration

```bash
supabase migration new your_migration_name
# edit the generated file in supabase/migrations/
```

### Apply locally

```bash
supabase db reset
```

This rebuilds your local database from all migrations in order.

---

## CI/CD

Migrations are automatically deployed to production via GitHub Actions when changes to `supabase/migrations/` are merged into `main`.

### Required GitHub repository secrets

| Secret | Where to find it |
|---|---|
| `SUPABASE_ACCESS_TOKEN` | supabase.com → Account → Access Tokens |
| `SUPABASE_PROJECT_REF` | supabase.com/dashboard/project/**[ref]** |
| `SUPABASE_DB_PASSWORD` | Supabase dashboard → Project Settings → Database |

### Workflow

`.github/workflows/migrate.yml` — triggers on push to `main` when migration files change.

---

## Deployment (Vercel)

Add production environment variables in **Vercel → Project → Settings → Environment Variables**:

```
NEXT_PUBLIC_SUPABASE_URL         = https://yourref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = your_prod_publishable_key
```

Find both in **Supabase dashboard → Project → Settings → API**.

---

## Project Structure

```
src/
├── app/
│   ├── landingPage/        # Landing page components + CSS Modules
│   ├── groomer-onboarding/ # Partner signup page
│   ├── request-pickup/     # Pet owner booking page
│   └── page.tsx            # Home page
├── components/
│   └── icons/              # Shared icon components
└── lib/
    └── supabase/           # Supabase client helpers
supabase/
├── config.toml             # Local Supabase config (custom ports)
└── migrations/             # Database migrations
.github/
└── workflows/
    └── migrate.yml         # CI/CD — auto-deploy migrations to prod
```
