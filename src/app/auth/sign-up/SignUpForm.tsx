"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp } from "@/lib/auth/actions";
import { initialAuthActionState } from "@/lib/auth/types";
import { EmailField } from "@/app/auth/components/EmailField";
import { PasswordField } from "@/app/auth/components/PasswordField";
import { SubmitButton } from "@/app/auth/components/SubmitButton";
import styles from "@/app/auth/auth.module.css";

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(
    signUp,
    initialAuthActionState,
  );

  return (
    <form className={styles.authForm} action={formAction}>
      {state.error && <p className={styles.authError}>{state.error}</p>}

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

      <p className={styles.authFooter}>
        Already have an account?{" "}
        <Link className={styles.authLink} href="/auth/login">
          Sign in
        </Link>
      </p>
    </form>
  );
}
