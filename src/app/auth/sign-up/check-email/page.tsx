import Link from "next/link";
import { AuthCard } from "@/app/auth/components/AuthCard";
import styles from "@/app/auth/auth.module.css";

export default function CheckEmailPage() {
  return (
    <AuthCard>
      <h1 className={styles.authTitle}>Check your email</h1>
      <p className={styles.authSubtitle}>
        We sent you a confirmation link. Click it to activate your account.
      </p>
      <Link className={styles.authLink} href="/auth/login">
        Back to login
      </Link>
    </AuthCard>
  );
}
