// Part of the (deleteWhenReady) route group — delete the whole folder.

import Link from "next/link";
import { CodePanel } from "@/app/(deleteWhenReady)/CodePanel";
import styles from "@/app/(deleteWhenReady)/page.module.css";

type Step = {
  title: string;
  description?: string;
  note?: string;
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
          "Supabase's local stack (Postgres, auth, storage) runs inside Docker containers on your machine — the commands below need it running in the background.",
        note:
          "New to Docker? It's a tool that packages a program together with everything it needs to run into a self-contained \"container,\" so it behaves the same on any machine — think of it like a lightweight virtual machine. You don't need to learn it to use this template: install Docker Desktop, open the app once so it's running (you'll see its icon in your menu bar/taskbar), and leave it running in the background. Nothing else in this guide asks you to touch it directly.",
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
          "Click \"Use this template\" on GitHub to get your own copy, then clone it.",
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
          "npm install also installs the Supabase CLI — it's a project dependency, not something you install globally — so every supabase command here runs through npx.",
        commands: ["npm install", "npx supabase start"],
      },
      {
        title: "Set up your env file and run the app",
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
        description: "Scope it to this project — it's used by GitHub Actions to push migrations.",
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
        description: "Repo → Settings → Secrets and variables → Actions. Names must match exactly:",
        panelLabel: "GitHub Secrets",
        commands: [
          "SUPABASE_ACCESS_TOKEN",
          "SUPABASE_PROJECT_REF",
          "SUPABASE_DB_PASSWORD",
        ],
      },
    ],
  },
  {
    heading: "Push your first migration",
    steps: [
      {
        title: "Create and verify a migration locally",
        commands: ["npx supabase migration new init", "npx supabase db reset"],
      },
      {
        title: "Push it — this triggers the migration workflow",
        commands: ["git add supabase/migrations", "git commit -m \"Add migration\"", "git push"],
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
        description:
          "You won't know the site URL until after the first deploy — add it and redeploy once you do.",
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
          "Supabase's built-in mailer works out of the box for confirmation emails, but it's rate-limited project-wide — a couple of emails per hour, not per user — which is fine for testing and too low for real signups.",
        note:
          "Fix: Authentication → Emails → SMTP Settings, point it at your own provider (Resend, SendGrid, Postmark all have free tiers), then raise the rate limit under Authentication → Rate Limits. You're still using Supabase Auth — you're just supplying the outbound email server instead of borrowing their shared one.",
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
      <h2 className={styles.sectionHeading}>Setting up everything</h2>
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
                  <div className={hasPanel ? styles.stepRow : styles.stepRowSolo}>
                    <div className={styles.stepLeft}>
                      <p className={styles.stepHeading}>{step.title}</p>
                      {step.description && (
                        <p className={styles.stepBody}>{step.description}</p>
                      )}
                      {step.note && (
                        <div className={styles.calloutNote}>
                          <span aria-hidden="true">💡</span>
                          <p>{step.note}</p>
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
