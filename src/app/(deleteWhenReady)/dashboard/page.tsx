// Example protected page — part of the (deleteWhenReady) route group.
// Shows the requireUser() pattern; replace with your real protected pages.

import { requireUser } from "@/lib/auth/session";
import { signOut } from "@/lib/auth/actions";
import { AuthCard } from "@/app/auth/components/AuthCard";
import styles from "@/app/auth/auth.module.css";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <AuthCard>
      <h1 className={styles.authTitle}>Dashboard</h1>
      <p className={styles.authSubtitle}>Signed in as {user.email}</p>
      <form action={signOut}>
        <button className={styles.authSubmit} type="submit">
          Sign out
        </button>
      </form>
    </AuthCard>
  );
}
