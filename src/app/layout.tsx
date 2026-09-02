import type { Metadata } from "next";
import { Geist, Geist_Mono, Raleway } from "next/font/google";
import { InlineScript } from "@/app/components/InlineScript";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import styles from "@/app/layout.module.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Used for section headings (see .sectionHeading in the landing page CSS) —
// a distinct display font from the body's Geist Sans for visual contrast.
const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AuthTemplate",
  description: "A Next.js starting point with Supabase auth already wired up.",
};

// Runs before hydration so the stored theme applies before first paint —
// otherwise the page would flash light mode for dark-mode users. Can't read
// cookies/headers instead: this needs localStorage, which only exists in
// the browser. Dark is the default for first-time visitors (not just an
// OS-preference fallback) — falls back to it too if storage is unavailable
// (private browsing, etc.). ThemeToggle still lets anyone switch to light,
// and that choice persists via localStorage same as before.
const themeInitScript = `
  (function () {
    try {
      var theme = localStorage.getItem("theme");
      document.documentElement.setAttribute(
        "data-theme",
        theme === "dark" || theme === "light" ? theme : "dark"
      );
    } catch {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <InlineScript html={themeInitScript} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${raleway.variable}`}
      >
        <header className={styles.navbar}>
          <ThemeToggle />
        </header>
        {children}
      </body>
    </html>
  );
}
