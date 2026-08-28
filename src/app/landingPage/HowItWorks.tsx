import styles from "./HowItWorks.module.css";

const steps = [
  {
    number: "01",
    icon: "📅",
    title: "Schedule a pickup",
    description:
      "Book transportation for your dog's appointment through the Zoomies app or website in under 2 minutes.",
  },
  {
    number: "02",
    icon: "🚐",
    title: "We handle the ride",
    description:
      "A trusted Zoomies driver picks up your dog and safely transports them to their destination.",
  },
  {
    number: "03",
    icon: "🐕",
    title: "Your dog arrives ready",
    description:
      "Your dog gets to daycare, grooming, or another appointment on time — and you get a notification.",
  },
];

export default function HowItWorks() {
  return (
    <section className={styles.section} id="how-it-works">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>Simple &amp; Easy</span>
          <h2 className={styles.heading}>How Zoomies works</h2>
          <p className={styles.subheading}>
            Booking a ride for your dog takes less than 2 minutes.
          </p>
        </div>

        <div className={styles.steps}>
          {steps.map((step, i) => (
            <div key={i} className={styles.step}>
              <div className={styles.iconWrap}>
                <span className={styles.icon}>{step.icon}</span>
                <span className={styles.number}>{step.number}</span>
              </div>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.desc}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
