import { AuthCard } from "@/app/auth/components/AuthCard";
import { confirmEmail } from "@/lib/auth/actions";
import styles from "@/app/auth/auth.module.css";

export default async function ConfirmEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token_hash?: string; type?: string; next?: string }>;
}) {
  const { token_hash, type, next } = await searchParams;

  if (!token_hash || !type) {
    return (
      <AuthCard>
        <h1 className={styles.authTitle}>Invalid confirmation link</h1>
        <p className={styles.authSubtitle}>
          This link is missing required information. Request a new one and
          try again.
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <h1 className={styles.authTitle}>Confirm your email</h1>
      <p className={styles.authSubtitle}>
        Click below to finish confirming your email address.
      </p>
      <form action={confirmEmail}>
        <input type="hidden" name="token_hash" value={token_hash} />
        <input type="hidden" name="type" value={type} />
        <input type="hidden" name="next" value={next ?? "/dashboard"} />
        <button className={styles.authSubmit} type="submit">
          Confirm email
        </button>
      </form>
    </AuthCard>
  );
}
