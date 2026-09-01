import { AuthCard } from "@/app/auth/components/AuthCard";
import { confirmEmail } from "@/lib/auth/actions";
import styles from "@/app/auth/auth.module.css";

const COPY = {
  recovery: {
    title: "Reset your password",
    body: "Click below to continue resetting your password.",
    button: "Reset your password",
  },
  default: {
    title: "Confirm your email",
    body: "Click below to finish confirming your email address.",
    button: "Confirm email",
  },
} as const;

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

  const copy = type === "recovery" ? COPY.recovery : COPY.default;

  return (
    <AuthCard>
      <h1 className={styles.authTitle}>{copy.title}</h1>
      <p className={styles.authSubtitle}>{copy.body}</p>
      <form action={confirmEmail}>
        <input type="hidden" name="token_hash" value={token_hash} />
        <input type="hidden" name="type" value={type} />
        <input type="hidden" name="next" value={next ?? "/dashboard"} />
        <button className={styles.authSubmit} type="submit">
          {copy.button}
        </button>
      </form>
    </AuthCard>
  );
}
