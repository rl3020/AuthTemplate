// This whole file, and everything else in the (deleteWhenReady) route
// group, is template onboarding content — not part of the app itself.
// Delete the entire (deleteWhenReady) folder once you're wired up; the
// parenthesized name keeps it out of the URL, so /dashboard (inside it)
// still routes normally. Replace this page with your actual home page.

import { AuthToggle } from "@/app/components/AuthToggle";
import { SetupGuide } from "@/app/(deleteWhenReady)/SetupGuide";
import { WhatsIncluded } from "@/app/(deleteWhenReady)/WhatsIncluded";
import styles from "@/app/(deleteWhenReady)/page.module.css";

export default function Page() {
  return (
    <main className={styles.landing}>
      <div className={styles.hero}>
        <div className={styles.header}>
          <h1 className={styles.title}>AuthTemplate</h1>
          <p className={styles.subtitle}>
            A Next.js + Supabase starting point with email/password sign-up,
            login, sessions, and protected routes already wired up — so you
            can skip the auth boilerplate and get straight to building.
            Follow the steps below to connect your own Supabase project and
            deploy it.
          </p>
        </div>
        <div className={styles.grid}>
          <div className={styles.guideCol}>
            <WhatsIncluded />
          </div>
          <div className={styles.authCol}>
            <AuthToggle />
          </div>
        </div>
      </div>
      <SetupGuide />
    </main>
  );
}
