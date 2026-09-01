import styles from "@/app/auth/auth.module.css";

export function SubmitButton({
  pending,
  label,
  pendingLabel,
}: {
  pending: boolean;
  label: string;
  pendingLabel: string;
}) {
  return (
    <button className={styles.authSubmit} type="submit" disabled={pending}>
      {pending ? pendingLabel : label}
    </button>
  );
}
