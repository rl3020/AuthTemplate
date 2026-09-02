// This whole file, and everything else in the (deleteWhenReady) route
// group, is template onboarding content — not part of the app itself.
// Delete the entire (deleteWhenReady) folder once you're wired up; the
// parenthesized name keeps it out of the URL, so /dashboard (inside it)
// still routes normally. Replace this page with your actual home page.

import { AuthToggle } from "@/app/components/AuthToggle";
import { RepoFileStructure } from "@/app/(deleteWhenReady)/RepoFileStructure";
import { SetupGuide } from "@/app/(deleteWhenReady)/SetupGuide";
import { SetupPrompt } from "@/app/(deleteWhenReady)/SetupPrompt";
import { WhatsIncluded } from "@/app/(deleteWhenReady)/WhatsIncluded";
import styles from "@/app/(deleteWhenReady)/page.module.css";

export default function Page() {
  return (
    <main className={styles.landing}>
      <div className={styles.hero}>
        <div className={styles.grid}>
          <div className={styles.guideCol}>
            <div className={styles.header}>
              <h1 className={styles.title}>AuthTemplate</h1>
              <p className={styles.subtitle}>
                A Next.js + Supabase auth template with email/password sign-up,
                login, and sessions so you can skip the boilerplate and get
                straight to building. To start, just create a copy of the
                template, use the prompt to set up the code, and start building
                your app.
              </p>
              <div className={styles.heroActions}>
                <a
                  className={styles.primaryButton}
                  href="https://github.com/rl3020/AuthTemplate/generate"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className={styles.stepBadge} aria-hidden="true">
                    1
                  </span>
                  Use this template
                </a>
                <span className={styles.heroArrow} aria-hidden="true">
                  →
                </span>
                {/* A plain <a>, not next/link — Link's client-side routing
                    fights the browser's native hash scroll once the page is
                    already scrolled, which is exactly the bug this replaced. */}
                <a className={styles.secondaryButton} href="#setup-prompt">
                  <span className={styles.stepBadge} aria-hidden="true">
                    2
                  </span>
                  Set up with prompt
                </a>
              </div>
            </div>
          </div>
          <div className={styles.authCol}>
            <AuthToggle />
          </div>
        </div>
        <WhatsIncluded />
        <RepoFileStructure />
      </div>
      <SetupPrompt />
      <SetupGuide />
    </main>
  );
}
