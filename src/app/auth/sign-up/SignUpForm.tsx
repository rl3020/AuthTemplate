"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp } from "@/lib/auth/actions";
import { initialAuthActionState } from "@/lib/auth/types";
import { EmailField } from "@/app/auth/components/EmailField";
import { PasswordField } from "@/app/auth/components/PasswordField";
import { SubmitButton } from "@/app/auth/components/SubmitButton";
import authStyles from "@/app/auth/auth.module.css";
import styles from "@/app/components/app.module.css";

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(
    signUp,
    initialAuthActionState,
  );

  return (
    <form className={styles.form} action={formAction}>
      {state.error && <p className={styles.error}>{state.error}</p>}

      <EmailField />

      <PasswordField
        id="password"
        name="password"
        label="Password"
        autoComplete="new-password"
        minLength={8}
      />

      <PasswordField
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm Password"
        autoComplete="new-password"
        minLength={8}
      />

      <SubmitButton pending={pending} label="Sign up" pendingLabel="Creating account…" />

      <p className={authStyles.authFooter}>
        Already have an account?{" "}
        <Link className={authStyles.authLink} href="/auth/login">
          Sign in
        </Link>
      </p>
    </form>
  );
}
