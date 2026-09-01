"use client";

import { useSyncExternalStore } from "react";
import styles from "@/app/components/ThemeToggle.module.css";

type Theme = "light" | "dark";

function getSnapshot(): Theme {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "dark" || attr === "light") return attr;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// Matches the un-themed server render — the beforeInteractive script (see
// layout.tsx) may apply data-theme before this ever mounts, and
// useSyncExternalStore is built to reconcile that kind of external change.
function getServerSnapshot(): Theme {
  return "light";
}

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", callback);
  return () => {
    observer.disconnect();
    media.removeEventListener("change", callback);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private browsing or storage disabled — theme just won't persist.
    }
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      className={styles.toggle}
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className={styles.icon} aria-hidden="true">☀️</span>
      <span className={styles.icon} aria-hidden="true">🌙</span>
      <span className={`${styles.thumb} ${isDark ? styles.thumbDark : ""}`} aria-hidden="true" />
    </button>
  );
}
