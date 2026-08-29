import Link from "next/link";
import styles from "@/app/page.module.css";

export default function Page() {
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>AuthTemplate</h1>
        <p className={styles.subtitle}>
          A Next.js starting point with Supabase auth already wired up. See{" "}
          <code>README.md</code> for what&apos;s included.
        </p>
        <div className={styles.actions}>
          <Link className={styles.primary} href="/sign-up">
            Sign up
          </Link>
          <Link className={styles.secondary} href="/login">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
