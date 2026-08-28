import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <span className={styles.logo}>🐾 Zoomies</span>
          <p className={styles.tagline}>
            Taking dogs where they need to go — safely, reliably, on time.
          </p>
        </div>

        <nav className={styles.links} aria-label="Footer navigation">
          <a href="#how-it-works">How It Works</a>
          <a href="#partners">For Partners</a>
          <a href="#trust">Safety</a>
          <a href="#book">Book a Pickup</a>
        </nav>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} Zoomies. All rights reserved.</p>
      </div>
    </footer>
  );
}
