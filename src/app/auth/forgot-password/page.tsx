import { ForgotPasswordForm } from "@/app/auth/forgot-password/ForgotPasswordForm";
import { AuthCard } from "@/app/auth/components/AuthCard";
import styles from "@/app/auth/auth.module.css";

export default function ForgotPasswordPage() {
  return (
    <AuthCard>
      <h1 className={styles.authTitle}>Reset your password</h1>
      <p className={styles.authSubtitle}>
        Enter your email and we&apos;ll send you a link to reset your password.
        Make sure your email is correct :)
      </p>
      <ForgotPasswordForm />
    </AuthCard>
  );
}
