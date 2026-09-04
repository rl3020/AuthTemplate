// Part of the (deleteWhenReady) route group — delete the whole folder.

"use client";

import { useState } from "react";
import styles from "@/app/(deleteWhenReady)/page.module.css";

// Shared by both prompt variants — everything through deploying to Vercel
// is identical regardless of which path someone picks. Connecting the
// deployed URL back to Supabase only matters for the Production path (it's
// about email links, and Free never sends email), so that step lives in
// the Production branch below, not here.
const PROMPT_TRUNK = `You're helping me take my copy of the AuthTemplate repo (Next.js + Supabase auth starter) from a fresh clone to a deployed app. Work through these in order, and check in with me at each numbered section before moving to the next.

Rule for the whole thing: never ask me to paste an API key, access token, or password directly into this chat. When a step needs a real secret, either have me paste it straight into a dashboard myself, or run the tool's own secure prompt (\`gh secret set\`, \`vercel env add\`, etc.) — those ask for the value directly in the terminal, hidden, without it ever passing through you.

Before doing anything else, read SETUP_CHECKLIST.md at the repo root — it ships with every checkbox unchecked and mirrors every step below. If any boxes are already checked, resume from the first unchecked one instead of starting over or re-asking me things it already answered (check its Notes section too — that's where earlier facts like my project ref or deployed URL should already be). As you complete each item, check it off in that file (edit the checkbox, don't just tell me it's done) and add anything later steps will need to the Notes section. Commit that file's changes along with whatever else you're committing at each step, same as any other file — it's meant to be real project history, not scratch state.

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
- Tell me to go to https://supabase.com/dashboard, click "New project", pick an org/region, and set a database password when prompted — tell me to write that password down myself, Supabase won't show it again, and not to paste it here.
- Ask me for the Project URL and Publishable key (Project Settings → API) once it finishes provisioning — those aren't secret, safe to paste here.
- Ask me for the project ref too (the string in the dashboard URL, supabase.com/dashboard/project/<ref>, also under Project Settings → General) — I'll reuse this in steps 5 and (if I go with Production) later. Not secret, safe to paste here.

## 4. Generate a Supabase access token
Manual: tell me to create one at https://supabase.com/dashboard/account/tokens, scoped to this project. This is a real secret — tell me to hold onto it for step 5, not paste it here.

## 5. Add the GitHub repository secrets
Three are needed: SUPABASE_ACCESS_TOKEN (from step 4), SUPABASE_PROJECT_REF (from step 3), and SUPABASE_DB_PASSWORD (from step 3). If the \`gh\` CLI is installed and authenticated against my repo, run \`gh secret set SUPABASE_ACCESS_TOKEN --repo <owner>/<repo>\` for each one — it prompts for the value directly in the terminal. If \`gh\` isn't available, tell me to add them manually at my repo → Settings → Secrets and variables → Actions → New repository secret, and wait for me to confirm.

## 6. First migrations
supabase/migrations/ already has two — nothing to create. One creates the profiles table with RLS policies; the other grants the authenticated role actual table-level access to it (RLS alone doesn't grant that — without it, every fresh hosted project hits "permission denied for table profiles" the moment anything touches it, even though local dev looks completely fine, since supabase start/db reset bootstraps default grants locally that a hosted project doesn't get). Both apply automatically the first time the "Deploy Supabase Migrations" GitHub Actions workflow runs after step 5. Tell me to trigger it: repo's Actions tab → "Deploy Supabase Migrations" → "Run workflow" button (it has a manual trigger built in, no new commit needed). This workflow only handles migrations — auth/email config is a separate "Deploy Supabase Config" workflow, covered in the Production path below.

If I ever ask you to add a new table later: enable RLS, add policies, *and* explicitly grant select/insert/update/delete on it to authenticated in the same migration — db reset won't catch a missing grant, only a real deploy will, so this is easy to miss.

## 7. Deploy to Vercel
Prefer the Vercel CLI so this stays scriptable:
1. \`npx vercel login\` if I'm not already logged in.
2. \`npx vercel link\` to connect this project (create a new Vercel project if prompted).
3. \`npx vercel env add NEXT_PUBLIC_SUPABASE_URL production\` and the same for NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY — each prompts for the value in the terminal; use the hosted values from step 3. Don't bother with NEXT_PUBLIC_SITE_URL — src/lib/site.ts already falls back to Vercel's own VERCEL_PROJECT_PRODUCTION_URL/VERCEL_URL when it's unset, so it's only needed if I'm using a custom domain.
4. \`npx vercel --prod\` to deploy.
5. Ask if I want a custom domain instead of the default *.vercel.app one — optional, skip if not. If yes: manual on my end, tell me to add it under the Vercel project → Settings → Domains, add the DNS records Vercel shows at my registrar, and wait for it to verify. Once it's set as the Production domain, VERCEL_PROJECT_PRODUCTION_URL picks it up automatically — no code change needed.

`;

const PROMPT_STEP_8_FREE = `## 8. You're done — nothing else to set up
SMTP_CONFIGURED already ships "false" at the top of .github/workflows/config.yml, and that's correct as-is — don't change it. Confirm with me that:
- Sign-up, login, sessions, protected routes, and the settings page all work end to end.
- Forgot/reset password does *not* work yet — that's expected on this path, not a bug. It only needs Supabase's free tier and no domain purchase, which is the whole point of this path.

There's nothing to touch in supabase/config.toml on this path either — site_url and the redirect-URL list only matter for email flows (confirmation/recovery), and this path doesn't send any, so the localhost defaults there are harmless.

Tell me this is revisitable any time — if I ever want working forgot/reset password, the fix is running through the Production version of this prompt, not redoing anything above.
`;

const PROMPT_STEP_8_PRODUCTION = `## 8. Add a real SMTP provider (required for working forgot/reset password)
This is manual on my end for the dashboard/DNS parts — walk me through it, don't try to do it yourself:
1. Resend: tell me to create an account at resend.com, go to Domains → Add Domain, and add the TXT/CNAME records it shows me at wherever I bought the domain (GoDaddy, Namecheap, Cloudflare, etc.), under DNS management. This can be a different domain than wherever the app itself is hosted. Tell me to wait until Resend shows the domain as "Verified" before continuing — sending fails until it does, and it can take a few minutes to longer while DNS propagates. Then tell me to go to API Keys → Create API Key — that's a secret, hold onto it, don't paste it here.
2. Tell me to point Supabase at it: Authentication → Emails → SMTP Settings, enable custom SMTP, and fill in:
   - Host: smtp.resend.com — Port: 587 (not 465 — Supabase's mailer can hang and time out connecting on 465 with Resend; 587 is the one that actually works, this cost real debugging time)
   - Username: resend (literally that word) — Password: the API key from step 1
   - Sender email: any address on the verified domain, e.g. noreply@mydomain.com — doesn't need to be a real inbox, it's just the From address
   - Sender name: any display name — both this and Sender email are required, the form won't save without them
   Then Authentication → Rate Limits → raise the email limit off Supabase's shared-mailer default.
3. Connect the deployed URL back to Supabase in code, not just the dashboard — the dashboard field gets silently overwritten back to localhost the next time config push runs, and it's not just about redirects: site_url is the literal value Supabase substitutes into the confirmation/recovery email templates, so getting this wrong means production emails link to localhost even though everything else works. At the bottom of supabase/config.toml, add:
\`\`\`
[remotes.production]
project_id = "<my project ref, from step 3 above — not a secret>"

[remotes.production.auth]
site_url = "<my production URL>"
additional_redirect_urls = ["<my production URL>", "<my production URL>/auth/confirm"]
\`\`\`
This keeps local dev's site_url as localhost while production gets its own override — supabase config push merges it automatically when pushing to that project ref, no manual toggling.
4. Edit SMTP_CONFIGURED to "true" at the top of .github/workflows/config.yml — this is what flips the config-push step from skipped to active. Commit and push this together with the config.toml change from step 3.
5. Tell me to check the Actions tab for "Deploy Supabase Config" (or trigger "Run workflow" on it) — the "Push config" step should now succeed (not skip) and push the custom email templates.
6. Have me actually request a password reset on the *deployed* app (not localhost) using an email that's genuinely registered on the hosted project (Authentication → Users) — the UI always shows "check your email" regardless of whether the account exists, by design, so a successful-looking response alone doesn't confirm anything. If nothing arrives, tell me to check Resend's own dashboard (Emails → Sending) to see whether it even received a send request — that tells us which side of the pipe the problem is on before we go looking further.
7. Mention that this also makes email confirmation available if I want it — it's a separate opt-in, enable_confirmations stays false in supabase/config.toml's [auth.email] block regardless of SMTP being set up, on purpose. Ask if I want it on; if yes, flip it to true, commit, and push (this applies to both local and production, there's no per-environment override for it the way there is for site_url). Leave it off if I don't say otherwise — sign-up already works fine without it.
`;

const PROMPT_CLEANUP = `
## 9. Clean up
Once everything above is confirmed working: delete the entire src/app/(deleteWhenReady)/ folder — onboarding content only (this landing page, the setup guide, an example dashboard), safe to remove since it's an isolated route group and won't break /auth/*, /settings, or src/lib/. Then update the title and description in src/app/layout.tsx's metadata to match my real project name. Also delete SETUP_CHECKLIST.md — it was only ever meant to track this setup, not stick around afterward.

Throughout: ask before anything destructive, and stop and tell me plainly if a command fails instead of guessing around it.`;

const PROMPT_TEXT_FREE = PROMPT_TRUNK + PROMPT_STEP_8_FREE + PROMPT_CLEANUP;
const PROMPT_TEXT_PRODUCTION = PROMPT_TRUNK + PROMPT_STEP_8_PRODUCTION + PROMPT_CLEANUP;

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
        Both prompts are identical through step 7 — they only diverge at
        step 8. <strong>Free</strong> skips email setup entirely
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
