// Part of the (deleteWhenReady) route group — delete the whole folder.

import Link from "next/link";
import type { ReactNode } from "react";
import { CodePanel } from "@/app/(deleteWhenReady)/CodePanel";
import { TrackCard, type Track } from "@/app/(deleteWhenReady)/TrackCard";
import styles from "@/app/(deleteWhenReady)/page.module.css";

type Step = {
  title: string;
  description?: string;
  bullets?: string[];
  noteTitle?: string;
  note?: string;
  noteBullets?: string[];
  href?: string;
  linkLabel?: string;
  panelLabel?: string;
  commands?: string[];
};

type Section = {
  heading: string;
  steps: Step[];
};

// Mirrors supabase/migrations/20260830005405_init.sql, shown here so
// "your first migration" means the one already in the repo, not a new one.
const initMigrationSql = [
  "create table public.profiles (",
  "  id uuid primary key references auth.users(id) on delete cascade,",
  "  display_name text",
  ");",
  "",
  "alter table public.profiles enable row level security;",
  "",
  'create policy "Users can view their own profile"',
  "  on public.profiles for select",
  "  using (auth.uid() = id);",
  "",
  'create policy "Users can update their own profile"',
  "  on public.profiles for update",
  "  using (auth.uid() = id);",
];

const sections: Section[] = [
  {
    heading: "Prerequisites",
    steps: [
      {
        title: "Install Node.js",
        description: "Version 20.19 or newer (22 or 24 LTS recommended).",
        href: "https://nodejs.org/en/download",
        linkLabel: "nodejs.org",
        commands: ["node -v"],
      },
      {
        title: "Install Docker Desktop and make sure it's running",
        description:
          "Supabase's local stack (Postgres, auth, storage) runs inside Docker containers on your machine.",
        noteTitle: "New to Docker?",
        note: "Think of containers as lightweight, self-contained environments. For this guide, just install Docker Desktop and leave it running.",
        href: "https://docs.docker.com/get-docker/",
        linkLabel: "Get Docker",
        commands: ["docker info"],
      },
      {
        title: "What you'll need for production (not local dev)",
        description:
          "Node and Docker above are all local dev needs. Going live also needs accounts with these — all have working free tiers:",
        bullets: [
          "A Supabase account, for your hosted project",
          "A Vercel account (or any Next.js host)",
          "A custom SMTP provider (e.g. Resend) — not optional, see the callout below",
          "A domain you own — SMTP providers only deliver to arbitrary recipients from a domain you've verified via DNS",
        ],
        noteTitle: "Why isn't SMTP optional?",
        note: "Supabase's free tier flatly refuses to push custom email templates on its own built-in mailer, and this template's click-through confirmation fix needs its own custom template — so without your own SMTP provider, the production config push fails and you're stuck on Supabase's default template, reopening the mail-scanner vulnerability the fix exists to close. SMTP providers' sandbox senders (e.g. Resend's onboarding@resend.dev) also only deliver to your own signup email, so real users need a domain you've verified via DNS too.",
      },
    ],
  },
  {
    heading: "Get the code",
    steps: [
      {
        title: "Use this template",
        description:
          'Click "Use this template" on GitHub to get your own copy, then clone it.',
        href: "https://github.com/rl3020/AuthTemplate",
        linkLabel: "github.com/rl3020/AuthTemplate",
        commands: ["git clone <your-repo-url>"],
      },
    ],
  },
  {
    heading: "Local setup",
    steps: [
      {
        title: "Install dependencies and start local Supabase",
        description:
          "npm install pulls down (see package.json for the full list):",
        bullets: [
          "Next.js and React — the framework",
          "The Supabase client libraries",
          "The Supabase CLI itself — a project dependency, not a global install, so every supabase command here runs through npx",
        ],
        href: "https://github.com/rl3020/AuthTemplate/blob/main/package.json",
        linkLabel: "package.json",
        commands: ["npm install", "npx supabase start"],
      },
      {
        title: "Set up your env file and run the app",
        bullets: [
          "cp copies .env.example to .env.local — paste in the Publishable key that supabase start just printed",
          "npm run dev starts the Next.js dev server, which reads that file and talks to your local Supabase stack, not a production one",
        ],
        commands: ["cp .env.example .env.local", "npm run dev"],
      },
    ],
  },
  {
    heading: "Create a Supabase project",
    steps: [
      {
        title: "Create the project",
        description:
          "Note the Project URL and Publishable key (Project Settings → API), and the database password (Project Settings → Database).",
        href: "https://supabase.com/dashboard",
        linkLabel: "supabase.com/dashboard",
      },
    ],
  },
  {
    heading: "Generate an access token",
    steps: [
      {
        title: "Create a personal access token",
        description:
          "Scope it to this project — it's used by GitHub Actions to push migrations.",
        href: "https://supabase.com/dashboard/account/tokens",
        linkLabel: "Account → Access Tokens",
      },
    ],
  },
  {
    heading: "Wire up GitHub Actions",
    steps: [
      {
        title: "Add three repository secrets",
        description:
          "The migration workflow below needs these to authenticate as you and reach your database — without them it fails with no way to connect.",
        bullets: [
          "Add them at: your GitHub repo → Settings → Secrets and variables → Actions (your repo, not this template's)",
          "Names must match exactly — see the panel",
        ],
        panelLabel: "GitHub Secrets",
        commands: [
          "SUPABASE_ACCESS_TOKEN",
          "SUPABASE_PROJECT_REF",
          "SUPABASE_DB_PASSWORD",
        ],
        href: "https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository",
        linkLabel: "GitHub docs: creating repository secrets",
      },
    ],
  },
  {
    heading: "Your first migration is already here",
    steps: [
      {
        title:
          "This template ships one migration — you don't need to create it",
        description:
          "It's what created the profiles table you saw in \"What's included\": Row Level Security enabled, plus policies so each user can only read/update their own row.",
        panelLabel: "supabase/migrations/20260830005405_init.sql",
        commands: initMigrationSql,
      },
      {
        title: "It goes live the first time the workflow runs",
        description:
          "The GitHub Action above applies every file in supabase/migrations/ with supabase db push whenever main gets a commit touching that folder. This one was already committed before you added the secrets, so:",
        bullets: [
          "Re-run the workflow now from your repo's Actions tab, or",
          "Just wait — your next real migration will bring this one along too, since db push applies everything not yet applied, not just what changed",
        ],
        href: "https://docs.github.com/en/actions/managing-workflow-runs/re-running-workflows-and-jobs",
        linkLabel: "GitHub docs: re-running a workflow",
      },
      {
        title: "Adding your own migration later looks like this",
        panelLabel: "Example: your next migration",
        commands: [
          "npx supabase migration new add_posts_table",
          "npx supabase db reset",
          "git add supabase/migrations",
          'git commit -m "Add posts table"',
          "git push",
        ],
      },
    ],
  },
  {
    heading: "Deploy to Vercel",
    steps: [
      {
        title: "Import the repo",
        href: "https://vercel.com/new",
        linkLabel: "vercel.com/new",
      },
      {
        title: "Add environment variables",
        bullets: [
          "NEXT_PUBLIC_SUPABASE_URL — your hosted project's API URL",
          "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY — the public key from Project Settings → API (safe to expose client-side — it's not a secret)",
          "NEXT_PUBLIC_SITE_URL — optional. src/lib/site.ts falls back to Vercel's own VERCEL_PROJECT_PRODUCTION_URL/VERCEL_URL when this isn't set, so on Vercel you only need it to override with a custom domain",
        ],
        panelLabel: "Vercel Env Vars",
        commands: [
          "NEXT_PUBLIC_SUPABASE_URL",
          "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
        ],
      },
      {
        title: "Add your deployed URL to Supabase",
        description:
          "Don't just add it in the dashboard — supabase/config.toml's additional_redirect_urls is what actually stays in sync. The dashboard field gets silently overwritten back to localhost the next time the migration workflow runs config push.",
        bullets: [
          "Add your production URL (and /auth/confirm) to additional_redirect_urls in supabase/config.toml",
          "Commit and push — that's what makes it permanent, not the dashboard edit",
        ],
      },
    ],
  },
];

const forkTracks: Track[] = [
  {
    id: "free",
    status: "free",
    label: "Free",
    tagline: "Zero email setup.",
    steps: [
      {
        title: "You're live",
        description:
          "Sign-up, login, sessions, and settings all work right now — nothing to configure.",
        note: "Forgot/reset password needs SMTP — see Production, any time.",
      },
    ],
  },
  {
    id: "production",
    status: "production",
    label: "Production",
    tagline: "Adds working password reset.",
    steps: [
      {
        title: "Forgot/reset password needs a real SMTP provider",
        description:
          "This is the one flow that can't skip email, and free-tier Supabase won't accept this template's custom recovery template without one — config push fails with:",
        panelLabel: "supabase config push",
        commands: [
          'unexpected status 400: {"message":"Email template modification is',
          'not available for free tier projects using the default email',
          'provider. Please upgrade your plan or configure a custom SMTP provider."}',
        ],
        flag: {
          label: "SMTP_CONFIGURED",
          value: "false",
          body: "Skipped by default — migrations still deploy either way. To enable:",
          bullets: [
            "Authentication → Emails → SMTP Settings — connect a provider (Resend's free tier: 3,000 emails/month, needs a verified domain)",
            "Authentication → Rate Limits — raise the default limit",
            'Set SMTP_CONFIGURED to "true" in .github/workflows/migrate.yml, commit, push',
            "Re-run the workflow — config push now succeeds",
          ],
          href: "https://supabase.com/docs/guides/auth/auth-smtp",
          linkLabel: "Supabase SMTP docs",
        },
      },
    ],
  },
];

// Numbers every trunk step sequentially across all sections (01, 02, 03,
// ...), computed once here rather than with a running counter inside the
// component — mutating a counter during render isn't safe to rely on. Track
// steps (the fork below) intentionally don't get numbers — see StepItem.
let stepCount = 0;
const numberedSections = sections.map((section) => ({
  ...section,
  steps: section.steps.map((step) => {
    stepCount += 1;
    return { step, number: String(stepCount).padStart(2, "0") };
  }),
}));

function StepBullets({ items }: { items: string[] }) {
  return (
    <ul className={styles.bulletList}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function StepPanel({ step }: { step: Step }) {
  if (!step.commands || step.commands.length === 0) return null;
  return (
    <div className={styles.stepRight}>
      <CodePanel label={step.panelLabel ?? "Terminal"} lines={step.commands} />
    </div>
  );
}

function StepNote({ step }: { step: Step }) {
  if (!step.note) return null;
  return (
    <div className={styles.calloutNote}>
      <p className={styles.calloutTitle}>
        <span aria-hidden="true">💡</span> {step.noteTitle ?? "Note"}
      </p>
      <p className={styles.calloutBody}>{step.note}</p>
      {step.noteBullets && <StepBullets items={step.noteBullets} />}
    </div>
  );
}

function StepFooterLink({ step }: { step: Step }) {
  if (!step.href) return null;
  return (
    <Link className={styles.stepLink} href={step.href} target="_blank" rel="noreferrer">
      {step.linkLabel ?? step.href}
      <span aria-hidden="true">↗</span>
    </Link>
  );
}

// Renders one trunk step's body (heading, description, bullets, callout,
// link, code panel) in the wide-page two-column grid (panel beside the
// text). Fork-track steps have their own rendering in TrackCard.tsx — that
// component's cards run much narrower than the trunk, so a shared
// side-by-side layout doesn't fit both.
function StepItem({ step, marker }: { step: Step; marker: ReactNode }) {
  const hasPanel = Boolean(step.commands?.length);

  return (
    <div className={styles.timelineRow}>
      <div className={styles.gutter}>{marker}</div>
      <div className={hasPanel ? styles.stepRow : styles.stepRowSolo}>
        <div className={styles.stepLeft}>
          <p className={styles.stepHeading}>{step.title}</p>
          {step.description && (
            <p className={styles.stepBody}>{step.description}</p>
          )}
          {step.bullets && <StepBullets items={step.bullets} />}
          <StepNote step={step} />
          <StepFooterLink step={step} />
        </div>
        <StepPanel step={step} />
      </div>
    </div>
  );
}

export function SetupGuide() {
  return (
    <div className={styles.guideSection}>
      <h2 className={styles.pageHeading}>Setup guide</h2>
      <div className={styles.stepList}>
        {numberedSections.map((section) => (
          <div key={section.heading} className={styles.stepGroup}>
            <div className={styles.timelineRow}>
              <div className={styles.gutter} />
              <h3 className={styles.sectionHeading}>{section.heading}</h3>
            </div>
            {section.steps.map(({ step, number }) => (
              <StepItem
                key={step.title}
                step={step}
                marker={<span className={styles.stepNumber}>{number}</span>}
              />
            ))}
          </div>
        ))}

        {/* Same rail container as every trunk section above, so the
            continuous line running through this whole timeline flows right
            up to the bottom of this heading with no gap — the fork curve
            below is a deliberately separate, centered element (see its own
            comment), not a continuation of this rail. */}
        <div className={styles.stepGroup}>
          <div className={styles.timelineRow}>
            <div className={styles.gutter} />
            <div>
              <h3 className={styles.sectionHeading}>Choose your path</h3>
              <p className={styles.forkIntro}>
                Both are finished states. Add Production whenever you want.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* A single stem down from the trunk, then two smooth curves diverging
          to sit above each track's horizontal center (25%/75% of the row).
          An SVG path rather than the border-radius trick used earlier —
          that rendered inconsistently across widths since it relied on a
          box's corner curving where two different borders happened to
          meet; a path is just the shape it says it is. viewBox 0 0 100 48
          with preserveAspectRatio="none" lets the whole thing stretch to
          the row's actual width while non-scaling-stroke keeps the line a
          crisp 1px regardless of that stretch. */}
      <svg
        className={styles.forkConnector}
        viewBox="0 0 100 48"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M50,0 L50,12 C50,26 25,26 25,40 L25,48"
          fill="none"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M50,0 L50,12 C50,26 75,26 75,40 L75,48"
          fill="none"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className={styles.forkTracks}>
        {forkTracks.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
}
