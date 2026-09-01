"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn } from "@/lib/auth/actions";
import { initialAuthActionState } from "@/lib/auth/types";
import { EmailField } from "@/app/auth/components/EmailField";
import { PasswordField } from "@/app/auth/components/PasswordField";
import { SubmitButton } from "@/app/auth/components/SubmitButton";
import authStyles from "@/app/auth/auth.module.css";
import styles from "@/app/components/app.module.css";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    signIn,
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
        autoComplete="current-password"
      />

      <SubmitButton pending={pending} label="Sign in" pendingLabel="Signing in…" />

      <p className={authStyles.authFooter}>
        <Link className={authStyles.authLink} href="/auth/forgot-password">
          Forgot password?
        </Link>
      </p>

      <p className={authStyles.authFooter}>
        Don&apos;t have an account?{" "}
        <Link className={authStyles.authLink} href="/auth/sign-up">
          Sign up
        </Link>
      </p>
    </form>
  );
}
