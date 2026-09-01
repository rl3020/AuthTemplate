import Link from "next/link";
import appStyles from "@/app/components/app.module.css";

// "Back to docs" points at "/" — the template's onboarding landing page.
// Once you delete (deleteWhenReady) and replace "/" with your real home
// page, this still works (it just links home), but you may want to change
// the label.
export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <main className={appStyles.container}>
      <div className={appStyles.shell}>
        <Link className={appStyles.backLink} href="/">
          ← Back to docs
        </Link>
        <div className={appStyles.card}>{children}</div>
      </div>
    </main>
  );
}
