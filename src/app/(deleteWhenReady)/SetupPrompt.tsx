// Part of the (deleteWhenReady) route group — delete the whole folder.

"use client";

import { useState } from "react";
import styles from "@/app/(deleteWhenReady)/page.module.css";

const PROMPT_TEXT = `You're helping me take my copy of the AuthTemplate repo (Next.js + Supabase auth starter) from a fresh clone to a deployed app. Work through these in order, and check in with me at each numbered section before moving to the next.

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
supabase/migrations/ already has one (the profiles table) — nothing to create. It applies automatically the first time the GitHub Actions workflow runs after step 5. Tell me to check my repo's Actions tab; if the "config push" step fails, that's expected until I set up custom SMTP later — the migration itself still lands either way.

## 7. Deploy to Vercel
Prefer the Vercel CLI so this stays scriptable:
1. \`npx vercel login\` if I'm not already logged in.
2. \`npx vercel link\` to connect this project (create a new Vercel project if prompted).
3. \`npx vercel env add NEXT_PUBLIC_SUPABASE_URL production\` and the same for NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY — each prompts for the value in the terminal; use the hosted values from step 3. For NEXT_PUBLIC_SITE_URL, add a placeholder for now since the real URL isn't known until after the first deploy.
4. \`npx vercel --prod\` to deploy.
5. Once it's live, tell me the real production URL, update NEXT_PUBLIC_SITE_URL to match, and redeploy.

## 8. Connect the deployed URL back to Supabase
Manual: tell me to add my Vercel URL to Supabase dashboard → Authentication → URL Configuration → Redirect URLs, or the confirmation email link gets rejected.

## 9. Clean up
Once everything above is confirmed working: delete the entire src/app/(deleteWhenReady)/ folder — onboarding content only (this landing page, the setup guide, an example dashboard), safe to remove since it's an isolated route group and won't break /auth/*, /settings, or src/lib/. Then update the title and description in src/app/layout.tsx's metadata to match my real project name.

Throughout: ask before anything destructive, and stop and tell me plainly if a command fails instead of guessing around it. Custom SMTP (for real signup volume, beyond Supabase's rate-limited default mailer) is intentionally not in this list — I'll set that up myself separately when I'm ready.`;

const COLLAPSED_MAX_HEIGHT = 260;

export function SetupPrompt() {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(PROMPT_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section id="setup-prompt" className={styles.promptSection}>
      <h2 className={styles.pageHeading}>Set up with your AI coding assistant</h2>
      <p className={styles.promptCaption}>
        Paste this into Claude Code, Cursor, Windsurf, Copilot&apos;s agent
        mode, or any other coding assistant with terminal access, and it
        walks you through the whole flow below — cloning, local setup,
        creating your Supabase project, wiring up GitHub Actions, deploying
        to Vercel, and cleaning up this onboarding folder at the end. It
        checks in with you at each step and never asks you to paste a
        secret into the chat itself — real credentials go through each
        tool&apos;s own secure prompt (<code>gh secret set</code>,{" "}
        <code>vercel env add</code>) or straight into a dashboard, so
        nothing sensitive ever passes through the assistant.
      </p>
      <div className={styles.treeWrap}>
        <div
          className={styles.promptBox}
          style={!expanded ? { maxHeight: COLLAPSED_MAX_HEIGHT, overflowY: "hidden" } : undefined}
        >
          {PROMPT_TEXT}
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
        <button type="button" className={styles.expandButton} onClick={handleCopy}>
          {copied ? "Copied" : "Copy prompt"}
        </button>
      </div>
    </section>
  );
}
