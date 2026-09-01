"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/auth/actions";
import { initialAuthActionState } from "@/lib/auth/types";
import { EmailField } from "@/app/auth/components/EmailField";
import { SubmitButton } from "@/app/auth/components/SubmitButton";
import styles from "@/app/auth/auth.module.css";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    initialAuthActionState,
  );

  return (
    <form className={styles.authForm} action={formAction}>
      {state.error && <p className={styles.authError}>{state.error}</p>}

      <EmailField />

      <SubmitButton
        pending={pending}
        label="Send reset link"
        pendingLabel="Sending…"
      />

      <p className={styles.authFooter}>
        Remembered your password?{" "}
        <Link className={styles.authLink} href="/auth/login">
          Sign in
        </Link>
      </p>
    </form>
  );
}
