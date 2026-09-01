// Part of the (deleteWhenReady) route group — delete the whole folder.

"use client";

import { useState } from "react";
import styles from "@/app/(deleteWhenReady)/page.module.css";

const PROMPT_TEXT = `You're helping me set up a cloned copy of the AuthTemplate repo (Next.js + Supabase auth starter) on my machine. Please, in order:

1. If this directory isn't already the cloned repo, clone it and cd in. Otherwise use the current directory.
2. Run \`npm install\`.
3. Confirm Docker is installed and running (e.g. \`docker info\`). If it isn't, tell me to install and start Docker Desktop, then stop and wait for me.
4. Run \`npx supabase start\`. It prints a local API URL and a Publishable key — read them from the output.
5. Copy \`.env.example\` to \`.env.local\`, then fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY with the values from step 4. Leave NEXT_PUBLIC_SITE_URL as http://localhost:3000.
6. Run \`npm run dev\` and confirm the app responds at http://localhost:3000.
7. Ask me to confirm the app looks right in the browser before continuing.
8. Once I confirm: delete the entire src/app/(deleteWhenReady)/ folder — it's onboarding content only (this landing page, the setup guide, and an example dashboard), not part of the real app. Deleting it won't break /auth/*, /settings, or anything under src/lib/ — it's an isolated route group.
9. Update the title and description in src/app/layout.tsx's metadata to match my actual project name.

Do not create, modify, or push any GitHub repository secrets, Supabase hosted projects, custom SMTP/email settings, or any other credentials — none of that is needed for local setup, and I'll handle any of that myself later if I need it. Everything above only touches this local machine and the local Supabase Docker stack, so nothing here involves a real secret. Ask before running anything you're unsure about, and stop and tell me if a command fails instead of guessing around it.`;

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
        mode, or any other coding assistant with terminal access, and it runs
        the local setup for you — installing dependencies, starting Supabase
        locally, writing your env file, and cleaning up this onboarding
        folder once you&apos;re ready. It never touches a real secret: every
        step stays on your machine, using only the local Supabase stack&apos;s
        own dev credentials — no hosted accounts, API keys, or GitHub
        secrets involved.
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
