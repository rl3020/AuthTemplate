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
// otherwise the page would flash the wrong mode. Can't read cookies/headers
// instead: this needs localStorage, which only exists in the browser.
// Defaults to the device's own OS preference (via the
// @media (prefers-color-scheme: dark) fallback in globals.css) when there's
// no stored choice yet — only sets data-theme explicitly once someone's
// picked a side via ThemeToggle, which persists that choice here.
const themeInitScript = `
  (function () {
    try {
      var theme = localStorage.getItem("theme");
      if (theme === "dark" || theme === "light") {
        document.documentElement.setAttribute("data-theme", theme);
      }
    } catch {
      // Private browsing or storage disabled — falls back to prefers-color-scheme.
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
