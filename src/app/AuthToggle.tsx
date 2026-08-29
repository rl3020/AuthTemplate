"use client";

import { useState } from "react";
import { LoginForm } from "@/app/login/LoginForm";
import { SignUpForm } from "@/app/sign-up/SignUpForm";
import styles from "@/app/auth/auth.module.css";

type Mode = "login" | "signup";

export function AuthToggle() {
  const [mode, setMode] = useState<Mode>("login");

  return (
    <div className={styles.card}>
      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${mode === "login" ? styles.tabActive : ""}`}
          onClick={() => setMode("login")}
        >
          Sign in
        </button>
        <button
          type="button"
          className={`${styles.tab} ${mode === "signup" ? styles.tabActive : ""}`}
          onClick={() => setMode("signup")}
        >
          Sign up
        </button>
      </div>
      {mode === "login" ? <LoginForm /> : <SignUpForm />}
    </div>
  );
}
