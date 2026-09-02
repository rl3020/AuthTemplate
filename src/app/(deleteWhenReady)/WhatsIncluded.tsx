// Part of the (deleteWhenReady) route group — delete the whole folder.

import { FeatureCompareTable } from "@/app/(deleteWhenReady)/FeatureCompareTable";
import styles from "@/app/(deleteWhenReady)/page.module.css";

export function WhatsIncluded() {
  return (
    <section className={styles.included}>
      <h2 className={styles.pageHeading}>What&apos;s included</h2>
      <div className={styles.includedGrid}>
        <div>
          <p className={styles.includedCaption}>
            <strong className={styles.includedLead}>Free vs. Production</strong>{" "}
            — No, I&apos;m not charging anything for either. The issue is
            Supabase limits their free tier and prevents sending emails, which
            blocks email confirmation &amp; forgot/reset password from working.
            This template therefore supports two paths:
          </p>
          <ul className={styles.bulletList}>
            <li>
              <strong>Free</strong> runs entirely on Supabase&apos;s free tier
              with zero email config setup — sign-up, login, sessions, and
              settings all work end to end, you just don&apos;t get working
              forgot/reset password.
            </li>
            <li>
              <strong>Production</strong> adds a custom SMTP provider (eg.
              Resend) and a domain you own, which unlocks that last piece.
              That's what this website uses.
            </li>
          </ul>
          <p className={styles.includedCaption}>
            Both work end to end: start free, add Production whenever you
            actually need it — see the Setup guide&apos;s fork or the AI prompt
            below.
          </p>
          <div className={styles.calloutNote}>
            <span aria-hidden="true">💡</span>
            <div>
              <p>
                Why I built free: I don't want to be blocked on setting up a
                whole SMTP server and domainjust to get an app running. It costs
                money and takes time. Use the free version to get started
                quickly. It works, just don't forget your password :)
              </p>
            </div>
          </div>
        </div>
        <FeatureCompareTable />
      </div>
    </section>
  );
}
