import styles from "./TrustSection.module.css";

const trustItems = [
  {
    icon: "🛡️",
    title: "Trusted Drivers",
    description:
      "Drivers are carefully vetted and selected to transport pets responsibly and with care.",
  },
  {
    icon: "🚐",
    title: "Safe Ride Standards",
    description:
      "Dogs ride securely using appropriate safety measures throughout every single trip.",
  },
  {
    icon: "📱",
    title: "Pickup and Dropoff Updates",
    description:
      "Owners stay informed throughout the entire trip with real-time status notifications.",
  },
  {
    icon: "🤝",
    title: "Carefully Chosen Partners",
    description:
      "We only work with trusted local groomers and daycare providers who share our standards.",
  },
  {
    icon: "❤️",
    title: "Built Around Peace of Mind",
    description:
      "Every part of the experience is designed to feel thoughtful, safe, and completely dependable.",
  },
];

export default function TrustSection() {
  return (
    <section className={styles.section} id="trust">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Your dog is in good hands</h2>
          <p className={styles.subheading}>
            Safety and trust are at the center of everything we do.
          </p>
        </div>

        <div className={styles.grid}>
          {trustItems.map((item, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.iconBox}>{item.icon}</div>
                <div className={styles.check} aria-hidden="true">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path
                      d="M2 6.5L5 9.5L11 3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
