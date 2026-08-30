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
};

const nodes: Node[] = [
  { depth: 0, name: "src/", type: "folder" },
  { depth: 1, name: "app/", type: "folder" },
  {
    depth: 2,
    name: "(deleteWhenReady)/",
    type: "folder",
    note: "Route group — delete the whole folder, it's excluded from the URL",
    deletable: true,
  },
  { depth: 3, name: "page.tsx", type: "file", note: "Landing page → \"/\"", deletable: true },
  { depth: 3, name: "WhatsIncluded.tsx", type: "file", note: "This section", deletable: true },
  { depth: 3, name: "SetupGuide.tsx", type: "file", note: "Setup guide", deletable: true },
  { depth: 3, name: "CodePanel.tsx", type: "file", note: "Terminal panel used by the guide", deletable: true },
  { depth: 3, name: "dashboard/page.tsx", type: "file", note: "Protected-page example → \"/dashboard\"", deletable: true },
  { depth: 2, name: "AuthToggle.tsx", type: "file", note: "Sign in / sign up toggle" },
  { depth: 2, name: "login/", type: "folder", note: "Sign-in page + form" },
  { depth: 2, name: "sign-up/", type: "folder", note: "Sign-up page + form" },
  { depth: 2, name: "auth/", type: "folder" },
  { depth: 3, name: "confirm/route.ts", type: "file", note: "Email confirmation handler" },
  { depth: 3, name: "error/page.tsx", type: "file", note: "Auth error page" },
  { depth: 2, name: "layout.tsx", type: "file", note: "Root layout" },
  { depth: 2, name: "globals.css", type: "file", note: "Global styles" },
  { depth: 1, name: "lib/", type: "folder" },
  { depth: 2, name: "auth/", type: "folder" },
  { depth: 3, name: "actions.ts", type: "file", note: "signUp, signIn, signOut" },
  { depth: 3, name: "session.ts", type: "file", note: "getUser, requireUser" },
  { depth: 3, name: "useUser.ts", type: "file", note: "Reactive client hook" },
  { depth: 2, name: "supabase/", type: "folder", note: "Browser / server / proxy clients" },
  { depth: 2, name: "site.ts", type: "file", note: "Site URL helper" },
  { depth: 1, name: "proxy.ts", type: "file", note: "Session refresh + route gating" },
];

const COLLAPSED_MAX_HEIGHT = 280;

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

export function WhatsIncluded() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

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
            const isOpen = openKey === key;
            const icon = node.type === "folder" ? <FolderIcon /> : <FileIcon />;

            return (
              <div key={key} className={styles.treeRow}>
                {node.note ? (
                  <button
                    type="button"
                    className={styles.treePathButton}
                    style={{ paddingLeft: `${node.depth * 1.125}rem` }}
                    onClick={() => setOpenKey(isOpen ? null : key)}
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
                      onClick={() => setOpenKey(null)}
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
