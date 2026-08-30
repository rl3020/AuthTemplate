// Example protected page — part of the (deleteWhenReady) route group.
// Shows the requireUser() pattern; replace with your real protected pages.

import { requireUser } from "@/lib/auth/session";
import { signOut } from "@/lib/auth/actions";
import styles from "@/app/auth/auth.module.css";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Signed in as {user.email}</p>
        <form action={signOut}>
          <button className={styles.submit} type="submit">
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
