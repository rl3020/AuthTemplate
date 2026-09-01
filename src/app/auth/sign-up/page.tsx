import { SignUpForm } from "@/app/auth/sign-up/SignUpForm";
import { AuthCard } from "@/app/auth/components/AuthCard";
import styles from "@/app/auth/auth.module.css";

export default function SignUpPage() {
  return (
    <AuthCard>
      <h1 className={styles.authTitle}>Create an account</h1>
      <SignUpForm />
    </AuthCard>
  );
}
