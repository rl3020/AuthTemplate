"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn } from "@/lib/auth/actions";
import { initialAuthActionState } from "@/lib/auth/types";
import { PasswordField } from "@/app/auth/PasswordField";
import styles from "@/app/auth/auth.module.css";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    signIn,
    initialAuthActionState,
  );

  return (
    <form className={styles.form} action={formAction}>
      {state.error && <p className={styles.error}>{state.error}</p>}

      <div className={styles.field}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <PasswordField
        id="password"
        name="password"
        label="Password"
        autoComplete="current-password"
      />

      <button className={styles.submit} type="submit" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>

      <p className={styles.footer}>
        Don&apos;t have an account?{" "}
        <Link className={styles.link} href="/sign-up">
          Sign up
        </Link>
      </p>
    </form>
  );
}
