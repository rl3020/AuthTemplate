import styles from "@/app/auth/auth.module.css";

export function EmailField() {
  return (
    <div className={styles.authField}>
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
