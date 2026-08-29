import { SignUpForm } from "@/app/sign-up/SignUpForm";
import styles from "@/app/auth/auth.module.css";

export default function SignUpPage() {
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create an account</h1>
        <SignUpForm />
      </div>
    </main>
  );
}
