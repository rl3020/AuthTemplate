import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { getProfile } from "@/lib/profile/queries";
import { DisplayNameForm } from "@/app/settings/DisplayNameForm";
import authStyles from "@/app/auth/auth.module.css";
import styles from "@/app/components/app.module.css";

export default async function SettingsPage() {
  const user = await requireUser();
  const profile = await getProfile(user.id);

  return (
    <main className={styles.page}>
      <Link className={styles.backLink} href="/dashboard">
        ← Back to dashboard
      </Link>
      <h1 className={authStyles.authTitle}>Settings</h1>
      <p className={authStyles.authSubtitle}>Signed in as {user.email}</p>
      <DisplayNameForm initialDisplayName={profile?.display_name ?? ""} />
    </main>
  );
}
