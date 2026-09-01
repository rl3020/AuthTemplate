import appStyles from "@/app/components/app.module.css";

export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <main className={appStyles.container}>
      <div className={appStyles.card}>{children}</div>
    </main>
  );
}
