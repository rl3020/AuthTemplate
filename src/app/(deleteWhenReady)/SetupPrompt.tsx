// Part of the (deleteWhenReady) route group — delete the whole folder.

"use client";

import { useState } from "react";
import styles from "@/app/(deleteWhenReady)/page.module.css";

// Shared by both prompt variants — everything up through connecting the
// deployed URL back to Supabase is identical regardless of which path
// someone picks; the paths only diverge at what's step 9 below.
const PROMPT_TRUNK = `You're helping me take my copy of the AuthTemplate repo (Next.js + Supabase auth starter) from a fresh clone to a deployed app. Work through these in order, and check in with me at each numbered section before moving to the next.

Rule for the whole thing: never ask me to paste an API key, access token, or password directly into this chat. When a step needs a real secret, either have me paste it straight into a dashboard myself, or run the tool's own secure prompt (\`gh secret set\`, \`vercel env add\`, etc.) — those ask for the value directly in the terminal, hidden, without it ever passing through you.

## 1. Get the code
Check whether the current directory is already this repo (look for "auth-template" in package.json, or check \`git remote -v\`). If not, ask me for the repo URL — the copy I created by clicking "Use this template" on https://github.com/rl3020/AuthTemplate, not the template itself — then clone it and cd in.

## 2. Local setup
1. Run \`npm install\`.
2. Confirm Docker is installed and running (\`docker info\`). If not, tell me to install/start Docker Desktop and wait for me.
3. Run \`npx supabase start\` and read the local API URL and Publishable key it prints.
4. Copy \`.env.example\` to \`.env.local\`, fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY with those local values, and leave NEXT_PUBLIC_SITE_URL as http://localhost:3000.
5. Run \`npm run dev\` and confirm http://localhost:3000 loads. Ask me to confirm it looks right before continuing.

## 3. Create a hosted Supabase project
This part is manual on my end — walk me through it, don't try to do it yourself:
- Tell me to create a project at https://supabase.com/dashboard.
- Ask me for the Project URL and Publishable key (Project Settings → API) once it exists — those aren't secret, safe to paste here.
- Tell me to note the database password (Project Settings → Database) but hold onto it myself for step 5 — don't have me paste it here.

## 4. Generate a Supabase access token
Manual: tell me to create one at https://supabase.com/dashboard/account/tokens, scoped to this project. This is a real secret — tell me to hold onto it for step 5, not paste it here.

## 5. Add the GitHub repository secrets
Three are needed: SUPABASE_ACCESS_TOKEN, SUPABASE_PROJECT_REF (from the project's dashboard URL), and SUPABASE_DB_PASSWORD. If the \`gh\` CLI is installed and authenticated against my repo, run \`gh secret set SUPABASE_ACCESS_TOKEN --repo <owner>/<repo>\` for each one — it prompts for the value directly in the terminal. If \`gh\` isn't available, tell me to add them manually at my repo → Settings → Secrets and variables → Actions, and wait for me to confirm.

## 6. First migration
supabase/migrations/ already has one (the profiles table) — nothing to create. It applies automatically the first time the GitHub Actions workflow runs after step 5. Tell me to check my repo's Actions tab; the config-push step is skipped by design (not a failure) unless I've gone with the Production path below — the migration itself lands regardless.

## 7. Deploy to Vercel
Prefer the Vercel CLI so this stays scriptable:
1. \`npx vercel login\` if I'm not already logged in.
2. \`npx vercel link\` to connect this project (create a new Vercel project if prompted).
3. \`npx vercel env add NEXT_PUBLIC_SUPABASE_URL production\` and the same for NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY — each prompts for the value in the terminal; use the hosted values from step 3. Don't bother with NEXT_PUBLIC_SITE_URL — src/lib/site.ts already falls back to Vercel's own VERCEL_PROJECT_PRODUCTION_URL/VERCEL_URL when it's unset, so it's only needed if I'm using a custom domain.
4. \`npx vercel --prod\` to deploy.

## 8. Connect the deployed URL back to Supabase
Don't just add it in the Supabase dashboard — that alone doesn't stick. supabase/config.toml's additional_redirect_urls is what actually controls this on the hosted project, and the GitHub Actions workflow runs \`supabase config push\` on every migration push, which overwrites the dashboard's redirect URLs back to whatever's in that file. So: add my production URL (and its /auth/confirm path) to additional_redirect_urls in supabase/config.toml, then commit and push — that's what makes it stick, not the dashboard edit.

`;

const PROMPT_STEP_9_FREE = `## 9. You're done — nothing else to set up
SMTP_CONFIGURED already ships "false" at the top of .github/workflows/migrate.yml, and that's correct as-is — don't change it. Confirm with me that:
- The email-template config-push step in Actions shows as skipped (not failed) — that's by design.
- Sign-up, login, sessions, protected routes, and the settings page all work end to end.
- Forgot/reset password does *not* work yet — that's expected on this path, not a bug. It only needs Supabase's free tier and no domain purchase, which is the whole point of this path.

Tell me this is revisitable any time — if I ever want working forgot/reset password, the fix is running through the Production version of this prompt, not redoing anything above.
`;

const PROMPT_STEP_9_PRODUCTION = `## 9. Add a real SMTP provider (required for working forgot/reset password)
1. Manual, walk me through it: create an account with a custom SMTP provider (Resend's free tier is 3,000 emails/month) and verify a domain there via DNS records. Note this can be a different domain than wherever the app itself is hosted — the SMTP-verified domain only controls the "from" address, not the app's URL.
2. Tell me to point Supabase at it: Authentication → Emails → SMTP Settings, then Authentication → Rate Limits to raise the limit off Supabase's shared-mailer default.
3. Edit SMTP_CONFIGURED to "true" at the top of .github/workflows/migrate.yml — this is the only code change this step needs, and it's what flips the config-push step in migrate.yml from skipped to active. Commit and push it.
4. Tell me to check the Actions tab — the "Push config" step should now succeed (not skip) and push the custom email templates.
5. Have me actually request a password reset on the deployed app and confirm the email arrives before calling this done — don't just trust the workflow going green.
`;

const PROMPT_CLEANUP = `
## 10. Clean up
Once everything above is confirmed working: delete the entire src/app/(deleteWhenReady)/ folder — onboarding content only (this landing page, the setup guide, an example dashboard), safe to remove since it's an isolated route group and won't break /auth/*, /settings, or src/lib/. Then update the title and description in src/app/layout.tsx's metadata to match my real project name.

Throughout: ask before anything destructive, and stop and tell me plainly if a command fails instead of guessing around it.`;

const PROMPT_TEXT_FREE = PROMPT_TRUNK + PROMPT_STEP_9_FREE + PROMPT_CLEANUP;
const PROMPT_TEXT_PRODUCTION = PROMPT_TRUNK + PROMPT_STEP_9_PRODUCTION + PROMPT_CLEANUP;

type Version = "free" | "production";

const COLLAPSED_MAX_HEIGHT = 260;

export function SetupPrompt() {
  const [version, setVersion] = useState<Version>("free");
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const promptText = version === "free" ? PROMPT_TEXT_FREE : PROMPT_TEXT_PRODUCTION;

  async function handleCopy() {
    await navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section id="setup-prompt" className={styles.promptSection}>
      <h2 className={styles.pageHeading}>Set up with your AI coding assistant</h2>
      <p className={styles.promptCaption}>
        Before starting, make sure you&apos;ve made a copy of the template on
        GitHub{" "}
        <a
          className={styles.inlineLink}
          href="https://github.com/rl3020/AuthTemplate/generate"
          target="_blank"
          rel="noreferrer"
        >
          here
        </a>
        .
      </p>
      <p className={styles.promptCaption}>
        To get started quickly, paste either the free or production prompt
        into your preferred agent (ex. Claude Code). Your agent will be
        given instructions to complete as much of the flow as possible for
        you — like running the local setup commands and cleaning up the
        onboarding folder. It will ask you to intervene when necessary —
        when creating a Supabase project or handling secrets.
      </p>
      <p className={styles.promptCaption}>
        Both prompts are identical through step 8 — they only diverge at
        step 9. <strong>Free</strong> skips email setup entirely
        (forgot/reset password won&apos;t work); <strong>Production</strong>{" "}
        adds SMTP so it does. Switch anytime by running the other prompt.
      </p>
      <div className={styles.promptHeaderRow}>
        <div className={styles.versionToggle}>
          <button
            type="button"
            className={styles.versionTab}
            data-active={version === "free"}
            onClick={() => setVersion("free")}
          >
            Free
          </button>
          <button
            type="button"
            className={styles.versionTab}
            data-active={version === "production"}
            data-accent="secure"
            onClick={() => setVersion("production")}
          >
            Production
          </button>
        </div>
        <button type="button" className={styles.expandButton} onClick={handleCopy}>
          {copied ? "Copied" : "Copy prompt"}
        </button>
      </div>
      <div className={styles.treeWrap}>
        <div
          className={styles.promptBox}
          data-version={version}
          style={!expanded ? { maxHeight: COLLAPSED_MAX_HEIGHT, overflowY: "hidden" } : undefined}
        >
          {promptText}
        </div>
        {!expanded && <div className={styles.treeFade} />}
      </div>
      <div className={styles.promptActions}>
        <button
          type="button"
          className={styles.expandButton}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Show less" : "Show full prompt"}
        </button>
      </div>
    </section>
  );
}
