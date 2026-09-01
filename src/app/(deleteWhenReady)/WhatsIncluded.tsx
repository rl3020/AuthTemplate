// Part of the (deleteWhenReady) route group — delete the whole folder.

"use client";

import { useState } from "react";
import styles from "@/app/(deleteWhenReady)/page.module.css";

type Node = {
  depth: number;
  name: string;
  type: "folder" | "file";
  note?: string;
  deletable?: boolean;
  defaultOpen?: boolean;
};

const nodes: Node[] = [
  { depth: 0, name: "src/", type: "folder" },
  { depth: 1, name: "app/", type: "folder" },
  {
    depth: 2,
    name: "(deleteWhenReady)/",
    type: "folder",
    note:
      "Onboarding content only — the landing page you're looking at right now, this file-tree section, the setup guide below, and the /dashboard example. It's a route group: the parentheses keep it out of the URL, so deleting the whole folder won't break any other route. Delete it once you've replaced the home page with your own.",
    deletable: true,
    defaultOpen: true,
  },
  {
    depth: 3,
    name: "page.tsx",
    type: "file",
    note:
      "The home page, served at \"/\". Renders WhatsIncluded (this section), SetupGuide, and the sign in/up card. Replace this file with your app's real home page once you're wired up.",
    deletable: true,
  },
  {
    depth: 3,
    name: "WhatsIncluded.tsx",
    type: "file",
    note: "Renders this section — the file tree with clickable notes you're reading right now.",
    deletable: true,
  },
  {
    depth: 3,
    name: "SetupGuide.tsx",
    type: "file",
    note: "Renders the numbered step-by-step guide below (Prerequisites, local setup, deployment, and so on).",
    deletable: true,
  },
  {
    depth: 3,
    name: "CodePanel.tsx",
    type: "file",
    note: "The dark terminal-style panel with a copy button, used throughout the setup guide for commands and env var names.",
    deletable: true,
  },
  {
    depth: 3,
    name: "dashboard/page.tsx",
    type: "file",
    note:
      "A working example of a protected page → \"/dashboard\". Calls requireUser() to redirect signed-out visitors, then shows the signed-in user's email with a sign-out button. Copy this pattern for your own protected pages.",
    deletable: true,
  },
  {
    depth: 2,
    name: "components/",
    type: "folder",
    note:
      "App-wide reusable UI, not tied to a specific route. ThemeToggle.tsx is the dark mode switch mounted in the root layout; AuthToggle.tsx is the sign in / sign up card on this home page, swapping between LoginForm and SignUpForm client-side without navigating to a different page.",
    defaultOpen: true,
  },
  {
    depth: 2,
    name: "auth/",
    type: "folder",
    note:
      "Every auth route and its shared UI, all in one place — not to be confused with lib/auth/ further down, which holds the actual signUp/signIn/signOut logic this folder calls into.",
    defaultOpen: true,
  },
  {
    depth: 3,
    name: "login/",
    type: "folder",
    note:
      "The \"/auth/login\" page. LoginForm.tsx inside it calls signIn() through React's useActionState, which gives you pending state and the last error for free.",
  },
  {
    depth: 3,
    name: "sign-up/",
    type: "folder",
    note:
      "The \"/auth/sign-up\" page. SignUpForm.tsx calls signUp() the same way LoginForm calls signIn(), and check-email/ is shown after sign-up when email confirmation is required.",
  },
  {
    depth: 3,
    name: "components/",
    type: "folder",
    note:
      "Pieces shared between LoginForm and SignUpForm: EmailField, PasswordField (with a show/hide toggle), SubmitButton, and the AuthCard shell every auth page renders inside.",
  },
  {
    depth: 3,
    name: "confirm/route.ts",
    type: "file",
    note:
      "A Route Handler that verifies the token from the confirmation email link, then redirects to /dashboard on success or /auth/error if it's invalid or expired.",
  },
  {
    depth: 3,
    name: "error/page.tsx",
    type: "file",
    note: "A generic page shown when an auth link is invalid, expired, or otherwise fails to verify.",
  },
  {
    depth: 2,
    name: "layout.tsx",
    type: "file",
    note:
      "The root layout — wraps every page, loads fonts, and mounts the dark mode toggle plus the pre-hydration script that sets the theme before first paint (so there's no flash of the wrong theme).",
  },
  {
    depth: 2,
    name: "globals.css",
    type: "file",
    note: "Shared resets, color tokens (including the dark mode overrides), and base element styles used across every page.",
  },
  { depth: 1, name: "lib/", type: "folder" },
  {
    depth: 2,
    name: "auth/",
    type: "folder",
    note:
      "The actual authentication logic: Server Actions, session helpers, and a reactive client hook. This is the one app/auth/ above calls into — that folder only has pages and a route handler.",
    defaultOpen: true,
  },
  {
    depth: 3,
    name: "actions.ts",
    type: "file",
    note: "signUp, signIn, and signOut — the three Server Actions that call Supabase directly. Every auth form in the template calls into these.",
  },
  {
    depth: 3,
    name: "session.ts",
    type: "file",
    note: "getUser() and requireUser(), for reading the session in Server Components. requireUser() redirects to /auth/login automatically when there's no session.",
  },
  {
    depth: 3,
    name: "useUser.ts",
    type: "file",
    note:
      "A reactive client-side hook for \"use client\" components that need live auth state, like a header badge. Not a security check — that's always requireUser() plus Row Level Security.",
  },
  {
    depth: 2,
    name: "supabase/",
    type: "folder",
    note:
      "Three Supabase client helpers, one per runtime: browser, server, and middleware. Using the wrong one is the most common source of auth bugs, so pick deliberately.",
  },
  {
    depth: 2,
    name: "site.ts",
    type: "file",
    note:
      "Builds the email confirmation link sent by Supabase. Auto-detects the deployment URL on Vercel; NEXT_PUBLIC_SITE_URL is an optional override for a custom domain or another host.",
  },
  {
    depth: 1,
    name: "proxy.ts",
    type: "file",
    note:
      "Next's middleware — refreshes the session cookie on every request and redirects signed-out visitors away from protected routes. A UX nicety only, not the real security boundary (requireUser() plus RLS is).",
  },
];

const COLLAPSED_MAX_HEIGHT = 420;

function FolderIcon() {
  return (
    <svg
      className={styles.folderIcon}
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1.5 3.5C1.5 2.94772 1.94772 2.5 2.5 2.5H6L7.5 4H13.5C14.0523 4 14.5 4.44772 14.5 5V12C14.5 12.5523 14.0523 13 13.5 13H2.5C1.94772 13 1.5 12.5523 1.5 12V3.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.5 1.5H9L12.5 5V14.5H3.5V1.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M9 1.5V5H12.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

function initialOpenKeys(): Set<string> {
  const keys = new Set<string>();
  nodes.forEach((node, index) => {
    if (node.defaultOpen) keys.add(`${index}-${node.name}`);
  });
  return keys;
}

export function WhatsIncluded() {
  const [openKeys, setOpenKeys] = useState<Set<string>>(initialOpenKeys);
  const [expanded, setExpanded] = useState(false);

  function toggleNote(key: string) {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  function closeNote(key: string) {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  }

  return (
    <section className={styles.included}>
      <h2 className={styles.sectionHeading}>What&apos;s included</h2>
      <p className={styles.includedCaption}>
        Everything not marked &quot;delete when ready&quot; is the actual
        template — keep it. Click a file or folder with a 💡 for details.
      </p>
      <div className={styles.treeWrap}>
        <div
          className={styles.tree}
          style={!expanded ? { maxHeight: COLLAPSED_MAX_HEIGHT, overflowY: "hidden" } : undefined}
        >
          {nodes.map((node, index) => {
            const key = `${index}-${node.name}`;
            const isOpen = openKeys.has(key);
            const icon = node.type === "folder" ? <FolderIcon /> : <FileIcon />;

            return (
              <div key={key} className={styles.treeRow}>
                {node.note ? (
                  <button
                    type="button"
                    className={styles.treePathButton}
                    style={{ paddingLeft: `${node.depth * 1.125}rem` }}
                    onClick={() => toggleNote(key)}
                    aria-expanded={isOpen}
                  >
                    {icon}
                    {node.name}
                    <span className={styles.hintBulb} aria-hidden="true">💡</span>
                  </button>
                ) : (
                  <span
                    className={styles.treePath}
                    style={{ paddingLeft: `${node.depth * 1.125}rem` }}
                  >
                    {icon}
                    {node.name}
                  </span>
                )}
                {isOpen && node.note && (
                  <div className={styles.bubble} role="note">
                    <button
                      type="button"
                      className={styles.bubbleClose}
                      onClick={() => closeNote(key)}
                      aria-label="Close note"
                    >
                      ×
                    </button>
                    <p className={styles.bubbleText}>
                      {node.note}
                      {node.deletable && (
                        <span className={styles.treeDelete}> · delete when ready</span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {!expanded && <div className={styles.treeFade} />}
      </div>
      <button
        type="button"
        className={styles.expandButton}
        onClick={() => setExpanded((value) => !value)}
      >
        {expanded ? "Show less" : "Show all files"}
      </button>
    </section>
  );
}
