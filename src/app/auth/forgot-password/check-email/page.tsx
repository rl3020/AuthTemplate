import Link from "next/link";
import { AuthCard } from "@/app/auth/components/AuthCard";
import styles from "@/app/auth/auth.module.css";

export default function ForgotPasswordCheckEmailPage() {
  return (
    <AuthCard>
      <h1 className={styles.authTitle}>Check your email</h1>
      <p className={styles.authSubtitle}>
        If an account exists for that email, we sent a link to reset your
        password.
      </p>
      <Link className={styles.authLink} href="/auth/login">
        Back to login
      </Link>
    </AuthCard>
  );
}
