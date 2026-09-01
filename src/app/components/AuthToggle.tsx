"use client";

import { useState } from "react";
import { LoginForm } from "@/app/auth/login/LoginForm";
import { SignUpForm } from "@/app/auth/sign-up/SignUpForm";
import appStyles from "@/app/components/app.module.css";
import toggleStyles from "@/app/components/AuthToggle.module.css";

type Mode = "login" | "signup";

export function AuthToggle() {
  const [mode, setMode] = useState<Mode>("login");

  return (
    <div className={appStyles.card}>
      <div className={toggleStyles.tabs}>
        <button
          type="button"
          className={`${toggleStyles.tab} ${mode === "login" ? toggleStyles.tabActive : ""}`}
          onClick={() => setMode("login")}
        >
          Sign in
        </button>
        <button
          type="button"
          className={`${toggleStyles.tab} ${mode === "signup" ? toggleStyles.tabActive : ""}`}
          onClick={() => setMode("signup")}
        >
          Sign up
        </button>
      </div>
      {mode === "login" ? <LoginForm /> : <SignUpForm />}
    </div>
  );
}
