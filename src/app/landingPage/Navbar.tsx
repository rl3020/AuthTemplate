"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <a href="/" className={styles.logo}>
          <span className={styles.logoPaw}>🐾</span>
          Zoomies
        </a>

        <ul className={`${styles.links} ${menuOpen ? styles.linksOpen : ""}`}>
          <li>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
              How It Works
            </a>
          </li>
          <li>
            <a href="#partners" onClick={() => setMenuOpen(false)}>
              For Partners
            </a>
          </li>
          <li>
            <a href="#trust" onClick={() => setMenuOpen(false)}>
              Safety
            </a>
          </li>
        </ul>

        <Link href="/request-pickup" className={styles.cta}>
          Book a Pickup
        </Link>

        <button
          className={styles.menuBtn}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className={menuOpen ? styles.spanOpen : ""} />
          <span className={menuOpen ? styles.spanOpen : ""} />
          <span className={menuOpen ? styles.spanOpen : ""} />
        </button>
      </div>
    </nav>
  );
}
