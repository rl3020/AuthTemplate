import Link from "next/link";
import styles from "./Hero.module.css";
import ArrowRight from "@/components/icons/ArrowRight";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        {/* Left: text content */}
        <div className={styles.content}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Now available in your area
          </div>

          <h1 className={styles.headline}>
            We take your dog to any appointment, so you don't have to.
          </h1>

          <p className={styles.subtitle}>
            Zoomies partners with local groomers and daycares to take your furry
            friend wherever they need to go.
          </p>

          <div className={styles.actions}>
            <Link href="/request-pickup" className={styles.primaryBtn}>
              Book a Pickup
              <ArrowRight />
            </Link>
            <Link href="/groomer-onboarding" className={styles.secondaryBtn}>
              Grooming Shops Partner With Us
            </Link>
          </div>
        </div>

        <VisualCard />
      </div>
    </section>
  );
}

// Components below here

// This is a static version of the pickup.
const VisualCard = () => {
  return (
    <div className={styles.visual}>
      <div className={styles.bgBlob} aria-hidden="true" />

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.statusDot} />
          <span className={styles.statusText}>Pickup in progress</span>
          <span className={styles.eta}>~12 min</span>
        </div>

        <div className={styles.dogRow}>
          <div className={styles.dogAvatar}>🐕</div>
          <div>
            <p className={styles.dogName}>Biscuit</p>
            <p className={styles.dogDest}>Heading to Paw Perfect Grooming</p>
          </div>
        </div>

        <div className={styles.progressSection}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} />
            <div className={`${styles.step} ${styles.done}`}>
              <span className={styles.stepDot} />
              <p>Picked up</p>
            </div>
            <div className={`${styles.step} ${styles.active}`}>
              <span className={styles.stepDot} />
              <p>En route</p>
            </div>
            <div className={styles.step}>
              <span className={styles.stepDot} />
              <p>Arrived</p>
            </div>
          </div>
        </div>

        <div className={styles.driverRow}>
          <span className={styles.driverIcon}>🚐</span>
          <div>
            <p className={styles.driverName}>Marcus D. · Zoomies Driver</p>
            <p className={styles.stars}>★★★★★</p>
          </div>
        </div>
      </div>

      <div className={styles.badge1} aria-hidden="true">
        <span>🛡️</span>
        <span>Trusted &amp; Vetted</span>
      </div>
      <div className={styles.badge2} aria-hidden="true">
        <span>🔔</span>
        <span>Real-time updates</span>
      </div>
    </div>
  );
};
