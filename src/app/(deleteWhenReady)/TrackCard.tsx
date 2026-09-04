// Part of the (deleteWhenReady) route group — delete the whole folder.
//
// One node in the setup guide's branching pipeline (see the fork in
// SetupGuide.tsx). Reuses CodePanel — the same terminal every other step
// on this page renders — rather than a one-off terminal style, so this
// card still reads as part of the same site.

import Link from "next/link";
import { CodePanel } from "@/app/(deleteWhenReady)/CodePanel";
import styles from "@/app/(deleteWhenReady)/TrackCard.module.css";

export type TrackStatus = "production" | "free";

export type Flag = {
  label: string;
  value: string;
  body: string;
  bullets?: string[];
  href?: string;
  linkLabel?: string;
};

export type TrackStep = {
  title: string;
  description?: string;
  bullets?: string[];
  note?: string;
  panelLabel?: string;
  commands?: string[];
  href?: string;
  linkLabel?: string;
  flag?: Flag;
};

export type Track = {
  id: string;
  status: TrackStatus;
  label: string;
  tagline: string;
  steps: TrackStep[];
};

export function TrackCard({ track }: { track: Track }) {
  return (
    <div className={styles.card} data-status={track.status}>
      <div className={styles.node} aria-hidden="true" />
      <div className={styles.header}>
        <span className={styles.statusTag}>
          <span className={styles.statusDot} aria-hidden="true" />
          {track.label.toLowerCase()}
        </span>
        <p className={styles.tagline}>{track.tagline}</p>
      </div>
      {track.steps.map((step, index) => (
        <div key={step.title} className={styles.step}>
          <p className={styles.stepTitle}>
            {track.steps.length > 1 && (
              <span className={styles.stepIndex}>{index + 1}</span>
            )}
            {step.title}
          </p>
          {step.description && <p className={styles.stepBody}>{step.description}</p>}

          {step.bullets && (
            <ul className={styles.stepBullets}>
              {step.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}

          {step.commands && step.commands.length > 0 && (
            <div className={styles.panelWrap}>
              <CodePanel label={step.panelLabel ?? "Terminal"} lines={step.commands} />
            </div>
          )}

          {step.note && <p className={styles.plainNote}>{step.note}</p>}

          {step.href && (
            <Link
              className={styles.flagLink}
              href={step.href}
              target="_blank"
              rel="noreferrer"
            >
              {step.linkLabel ?? step.href}
              <span aria-hidden="true">↗</span>
            </Link>
          )}

          {step.flag && (
            <div className={styles.flagNote}>
              <p className={styles.flagChip}>
                <span aria-hidden="true">⚑</span>
                <code>
                  {step.flag.label}={step.flag.value}
                </code>
              </p>
              <p className={styles.flagBody}>{step.flag.body}</p>
              {step.flag.bullets && (
                <ul className={styles.flagBullets}>
                  {step.flag.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {step.flag.href && (
                <Link
                  className={styles.flagLink}
                  href={step.flag.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {step.flag.linkLabel ?? step.flag.href}
                  <span aria-hidden="true">↗</span>
                </Link>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
