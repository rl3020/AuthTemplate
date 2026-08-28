import styles from "./OwnerBenefits.module.css";

const benefits = [
  {
    icon: "🗓️",
    title: "Convenient Pickup",
    description:
      "We handle the trip so you don't have to rearrange your entire day around a grooming appointment.",
  },
  {
    icon: "✅",
    title: "Reliable and On-Time",
    description:
      "Your dog gets where they need to go safely and on schedule — every time.",
  },
  {
    icon: "🔔",
    title: "Real-Time Updates",
    description:
      "Get notified the moment your dog is picked up and when they arrive at their destination.",
  },
  {
    icon: "⚡",
    title: "A Better Routine for Busy Days",
    description:
      "Perfect for workdays, packed schedules, or anyone without time for another drive across town.",
  },
  {
    icon: "🛡️",
    title: "Peace of Mind",
    description:
      "Every part of the experience is designed to help you feel confident trusting Zoomies with your dog.",
  },
];

export default function OwnerBenefits() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>For Pet Owners</span>
          <h2 className={styles.heading}>
            Less driving. Less stress.
            <br />
            More help for busy dog parents.
          </h2>
          <p className={styles.subheading}>
            Zoomies fits into your schedule — not the other way around.
          </p>
        </div>

        <div className={styles.grid}>
          {benefits.map((b, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.iconBox}>{b.icon}</div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{b.title}</h3>
                <p className={styles.cardDesc}>{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
