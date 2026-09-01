// Part of the (deleteWhenReady) route group — delete the whole folder.

import Link from "next/link";
import { CodePanel } from "@/app/(deleteWhenReady)/CodePanel";
import styles from "@/app/(deleteWhenReady)/page.module.css";

type Step = {
  title: string;
  description?: string;
  bullets?: string[];
  note?: string;
  noteBullets?: string[];
  href?: string;
  linkLabel?: string;
  panelLabel?: string;
  commands?: string[];
};

type NumberedStep = Step & { number: string };

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
        note: 'New to Docker? It packages a program with everything it needs into a self-contained "container," like a lightweight virtual machine. You don\'t need to learn it — just:',
        noteBullets: [
          "Install Docker Desktop",
          "Open it once so it's running (look for its icon in your menu bar/taskbar)",
          "Leave it running in the background — nothing else in this guide asks you to touch it directly",
        ],
        href: "https://docs.docker.com/get-docker/",
        linkLabel: "Get Docker",
        commands: ["docker info"],
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
          "NEXT_PUBLIC_SITE_URL — your production domain, used to build the confirmation email link. You won't know this until after the first deploy — add it and redeploy once you do",
        ],
        panelLabel: "Vercel Env Vars",
        commands: [
          "NEXT_PUBLIC_SUPABASE_URL",
          "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
          "NEXT_PUBLIC_SITE_URL",
        ],
      },
      {
        title: "Add your deployed URL to Supabase",
        description:
          "Authentication → URL Configuration → Redirect URLs — otherwise the confirmation email link gets rejected.",
      },
      {
        title: "Configure a real SMTP provider before you launch",
        description:
          "Supabase's built-in mailer works out of the box, but it's rate-limited project-wide — a couple of emails per hour, not per user. Fine for testing, too low for real signups.",
        note: "Fix — you're still using Supabase Auth, just supplying your own outbound email server:",
        noteBullets: [
          "Authentication → Emails → SMTP Settings — point it at your own provider (Resend, SendGrid, Postmark all have free tiers)",
          "Authentication → Rate Limits — raise the limit yourself once you're on your own SMTP",
        ],
        href: "https://supabase.com/docs/guides/auth/auth-smtp",
        linkLabel: "Supabase SMTP docs",
      },
    ],
  },
];

// Numbers every step sequentially across all sections (01, 02, 03, ...),
// computed once here rather than with a running counter inside the
// component — mutating a counter during render isn't safe to rely on.
let stepCount = 0;
const numberedSections = sections.map((section) => ({
  ...section,
  steps: section.steps.map((step): NumberedStep => {
    stepCount += 1;
    return { ...step, number: String(stepCount).padStart(2, "0") };
  }),
}));

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
            {section.steps.map((step) => {
              const hasPanel = Boolean(step.commands?.length);
              return (
                <div key={step.title} className={styles.timelineRow}>
                  <div className={styles.gutter}>
                    <span className={styles.stepNumber}>{step.number}</span>
                  </div>
                  <div
                    className={hasPanel ? styles.stepRow : styles.stepRowSolo}
                  >
                    <div className={styles.stepLeft}>
                      <p className={styles.stepHeading}>{step.title}</p>
                      {step.description && (
                        <p className={styles.stepBody}>{step.description}</p>
                      )}
                      {step.bullets && (
                        <ul className={styles.bulletList}>
                          {step.bullets.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      )}
                      {step.note && (
                        <div className={styles.calloutNote}>
                          <span aria-hidden="true">💡</span>
                          <div>
                            <p>{step.note}</p>
                            {step.noteBullets && (
                              <ul className={styles.bulletList}>
                                {step.noteBullets.map((item) => (
                                  <li key={item}>{item}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      )}
                      {step.href && (
                        <Link
                          className={styles.stepLink}
                          href={step.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {step.linkLabel ?? step.href}
                          <span aria-hidden="true">↗</span>
                        </Link>
                      )}
                    </div>
                    {step.commands && step.commands.length > 0 && (
                      <div className={styles.stepRight}>
                        <CodePanel
                          label={step.panelLabel ?? "Terminal"}
                          lines={step.commands}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
