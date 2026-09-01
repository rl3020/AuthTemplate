"use client";

import { useActionState } from "react";
import { updatePassword } from "@/lib/auth/actions";
import { initialAuthActionState } from "@/lib/auth/types";
import { PasswordField } from "@/app/auth/components/PasswordField";
import { SubmitButton } from "@/app/auth/components/SubmitButton";
import styles from "@/app/auth/auth.module.css";

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(
    updatePassword,
    initialAuthActionState,
  );

  return (
    <form className={styles.authForm} action={formAction}>
      {state.error && <p className={styles.authError}>{state.error}</p>}

      <PasswordField
        id="password"
        name="password"
        label="New password"
        autoComplete="new-password"
        minLength={8}
      />

      <PasswordField
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm new password"
        autoComplete="new-password"
        minLength={8}
      />

      <SubmitButton
        pending={pending}
        label="Update password"
        pendingLabel="Updating…"
      />
    </form>
  );
}
