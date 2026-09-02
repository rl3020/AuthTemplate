import Link from "next/link";
import { AuthCard } from "@/app/auth/components/AuthCard";
import styles from "@/app/auth/auth.module.css";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthCard>
      <h1 className={styles.authTitle}>Something went wrong</h1>
      <p className={styles.authSubtitle}>
        {error ?? "We couldn't complete that request."}
      </p>
      <Link className={styles.authLink} href="/auth/login">
        Back to login
      </Link>
    </AuthCard>
  );
}
