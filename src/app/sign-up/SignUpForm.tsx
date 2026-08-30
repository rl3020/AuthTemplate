"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp } from "@/lib/auth/actions";
import { initialAuthActionState } from "@/lib/auth/types";
import { PasswordField } from "@/app/auth/PasswordField";
import styles from "@/app/auth/auth.module.css";

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(
    signUp,
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

      <button className={styles.submit} type="submit" disabled={pending}>
        {pending ? "Creating account…" : "Sign up"}
      </button>

      <p className={styles.footer}>
        Already have an account?{" "}
        <Link className={styles.link} href="/login">
          Sign in
        </Link>
      </p>
    </form>
  );
}
