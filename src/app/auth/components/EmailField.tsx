import styles from "@/app/components/app.module.css";

export function EmailField() {
  return (
    <div className={styles.field}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
      />
    </div>
  );
}
