import styles from "@/app/components/app.module.css";

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
    <button className={styles.submit} type="submit" disabled={pending}>
      {pending ? pendingLabel : label}
    </button>
  );
}
