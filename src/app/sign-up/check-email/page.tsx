import Link from "next/link";
import styles from "@/app/auth/auth.module.css";

export default function CheckEmailPage() {
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Check your email</h1>
        <p className={styles.subtitle}>
          We sent you a confirmation link. Click it to activate your account.
        </p>
        <Link className={styles.link} href="/login">
          Back to login
        </Link>
      </div>
    </main>
  );
}
