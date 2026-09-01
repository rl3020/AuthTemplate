"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn } from "@/lib/auth/actions";
import { initialAuthActionState } from "@/lib/auth/types";
import { EmailField } from "@/app/auth/components/EmailField";
import { PasswordField } from "@/app/auth/components/PasswordField";
import { SubmitButton } from "@/app/auth/components/SubmitButton";
import styles from "@/app/auth/auth.module.css";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    signIn,
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
        autoComplete="current-password"
      />

      <SubmitButton pending={pending} label="Sign in" pendingLabel="Signing in…" />

      <p className={styles.authFooter}>
        Don&apos;t have an account?{" "}
        <Link className={styles.authLink} href="/auth/sign-up">
          Sign up
        </Link>
      </p>
    </form>
  );
}
