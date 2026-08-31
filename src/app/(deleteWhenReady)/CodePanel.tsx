"use client";

import { useState } from "react";
import styles from "@/app/(deleteWhenReady)/page.module.css";

export function CodePanel({ label, lines }: { label: string; lines: string[] }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelLabel}>{label}</span>
        <button
          type="button"
          className={copied ? styles.panelCopyCopied : styles.panelCopy}
          onClick={handleCopy}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className={styles.panelBody}>
        <code>
          {lines.map((line, index) => {
            const [first, ...rest] = line.split(" ");
            return (
              <div key={index}>
                <span className={styles.panelKeyword}>{first}</span>
                {rest.length > 0 ? ` ${rest.join(" ")}` : ""}
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
