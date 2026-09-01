import { ResetPasswordForm } from "@/app/auth/reset-password/ResetPasswordForm";
import { AuthCard } from "@/app/auth/components/AuthCard";
import { getUser } from "@/lib/auth/session";
import styles from "@/app/auth/auth.module.css";

// Reached only via the recovery email link, which verifies the token and
// signs the user in first (see confirmEmail) before redirecting here — so
// no session means the link was invalid, expired, or opened directly.
export default async function ResetPasswordPage() {
  const user = await getUser();

  if (!user) {
    return (
      <AuthCard>
        <h1 className={styles.authTitle}>Link expired</h1>
        <p className={styles.authSubtitle}>
          This password reset link is invalid or has expired. Request a new
          one and try again.
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <h1 className={styles.authTitle}>Set a new password</h1>
      <ResetPasswordForm />
    </AuthCard>
  );
}
