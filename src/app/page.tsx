import { AuthToggle } from "@/app/AuthToggle";
import styles from "@/app/auth/auth.module.css";

export default function Page() {
  return (
    <main className={styles.container}>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>AuthTemplate</h1>
          <p className={styles.subtitle}>
            A Next.js starting point with Supabase auth already wired up.
          </p>
        </div>
        <AuthToggle />
      </div>
    </main>
  );
}
