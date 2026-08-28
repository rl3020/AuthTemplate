import Link from "next/link";
import styles from "./FinalCTA.module.css";

export default function FinalCTA() {
  return (
    <section className={styles.section} id="book">
      <div className={styles.container}>
        <span className={styles.paw} aria-hidden="true">
          🐾
        </span>
        <h2 className={styles.heading}>
          Stop driving across town for dog appointments.
        </h2>
        <p className={styles.subtext}>
          Whether you&apos;re a busy pet owner or a grooming shop looking to
          grow, Zoomies makes transportation easy.
        </p>

        <div className={styles.actions}>
          <Link href="/request-pickup" className={styles.primaryBtn}>
            Book a Pickup
          </Link>
          <Link href="/groomer-onboarding" className={styles.secondaryBtn}>
            Grooming Shops Partner With Us
          </Link>
        </div>

        <div className={styles.trust}>
          <span>✓ No commitment required</span>
          <span className={styles.dot}>·</span>
          <span>✓ Real-time tracking</span>
          <span className={styles.dot}>·</span>
          <span>✓ Trusted drivers</span>
        </div>
      </div>
    </section>
  );
}
