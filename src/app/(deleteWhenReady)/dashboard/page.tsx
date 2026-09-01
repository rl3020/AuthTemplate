// Example protected page — part of the (deleteWhenReady) route group.
// Shows the requireUser() pattern; replace with your real protected pages.

import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { signOut } from "@/lib/auth/actions";
import { getProfile } from "@/lib/profile/queries";
import authStyles from "@/app/auth/auth.module.css";
import styles from "@/app/components/app.module.css";

export default async function DashboardPage() {
  const user = await requireUser();
  const profile = await getProfile(user.id);

  return (
    <main className={styles.page}>
      <Link className={styles.backLink} href="/">
        ← Back to docs
      </Link>
      <h1 className={authStyles.authTitle}>Dashboard</h1>
      {profile?.display_name ? (
        <p className={authStyles.authSubtitle}>
          Welcome, {profile.display_name}!
        </p>
      ) : (
        <p className={authStyles.authSubtitle}>
          You haven&apos;t set a display name yet — add one in{" "}
          <Link className={authStyles.authLink} href="/settings">
            Settings
          </Link>
          .
        </p>
      )}
      <p className={authStyles.authSubtitle}>Signed in as {user.email}</p>
      <div className={styles.actions}>
        <Link className={styles.secondaryButton} href="/settings">
          Settings
        </Link>
        <form action={signOut}>
          <button className={styles.submit} type="submit">
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
