import Link from "next/link";
import styles from "@/app/auth/auth.module.css";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Something went wrong</h1>
        <p className={styles.subtitle}>
          {error ?? "We couldn't complete that request."}
        </p>
        <Link className={styles.link} href="/login">
          Back to login
        </Link>
      </div>
    </main>
  );
}
