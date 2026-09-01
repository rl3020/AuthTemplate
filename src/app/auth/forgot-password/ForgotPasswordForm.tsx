"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/auth/actions";
import { initialAuthActionState } from "@/lib/auth/types";
import { EmailField } from "@/app/auth/components/EmailField";
import { SubmitButton } from "@/app/auth/components/SubmitButton";
import authStyles from "@/app/auth/auth.module.css";
import styles from "@/app/components/app.module.css";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    initialAuthActionState,
  );

  return (
    <form className={styles.form} action={formAction}>
      {state.error && <p className={styles.error}>{state.error}</p>}

      <EmailField />

      <SubmitButton
        pending={pending}
        label="Send reset link"
        pendingLabel="Sending…"
      />

      <p className={authStyles.authFooter}>
        Remembered your password?{" "}
        <Link className={authStyles.authLink} href="/auth/login">
          Sign in
        </Link>
      </p>
    </form>
  );
}
