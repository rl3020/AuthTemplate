"use client";

import { useState } from "react";
import { LoginForm } from "@/app/auth/login/LoginForm";
import { SignUpForm } from "@/app/auth/sign-up/SignUpForm";
import appStyles from "@/app/components/app.module.css";

type Mode = "login" | "signup";

export function AuthToggle() {
  const [mode, setMode] = useState<Mode>("login");

  return (
    <div className={appStyles.card}>
      <div className={appStyles.tabs}>
        <button
          type="button"
          className={`${appStyles.tab} ${mode === "login" ? appStyles.tabActive : ""}`}
          onClick={() => setMode("login")}
        >
          Sign in
        </button>
        <button
          type="button"
          className={`${appStyles.tab} ${mode === "signup" ? appStyles.tabActive : ""}`}
          onClick={() => setMode("signup")}
        >
          Sign up
        </button>
      </div>
      {mode === "login" ? <LoginForm /> : <SignUpForm />}
    </div>
  );
}
