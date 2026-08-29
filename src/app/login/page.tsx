import { LoginForm } from "@/app/login/LoginForm";
import styles from "@/app/auth/auth.module.css";

export default function LoginPage() {
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign in</h1>
        <LoginForm />
      </div>
    </main>
  );
}
