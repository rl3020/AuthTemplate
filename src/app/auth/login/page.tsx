import { LoginForm } from "@/app/auth/login/LoginForm";
import { AuthCard } from "@/app/auth/components/AuthCard";
import styles from "@/app/auth/auth.module.css";

export default function LoginPage() {
  return (
    <AuthCard>
      <h1 className={styles.authTitle}>Sign in</h1>
      <LoginForm />
    </AuthCard>
  );
}
