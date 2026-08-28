import Link from "next/link";
import styles from "./PartnerBenefits.module.css";
import ArrowRight from "@/components/icons/ArrowRight";

const benefits = [
  {
    icon: "👥",
    title: "Reach More Customers",
    description:
      "Serve pet owners who might otherwise skip or delay appointments because transportation is inconvenient.",
  },
  {
    icon: "📅",
    title: "Fill More Appointment Slots",
    description:
      "Reduce drop-off friction and make it easier for customers to commit to regular visits.",
  },
  {
    icon: "📍",
    title: "Expand Your Service Radius",
    description:
      "Attract dogs from farther away without needing to run transportation yourself.",
  },
  {
    icon: "⚙️",
    title: "No Extra Operational Burden",
    description:
      "Zoomies handles the transportation logistics so your team can stay focused on pet care.",
  },
  {
    icon: "⭐",
    title: "Modern Customer Experience",
    description:
      "Offer pickup support as a premium convenience that makes your business stand out.",
  },
];

export default function PartnerBenefits() {
  return (
    <section className={styles.section} id="partners">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>For Groomers &amp; Daycares</span>
          <h2 className={styles.heading}>
            More appointments.
            <br />
            Less friction.
          </h2>
          <p className={styles.subheading}>
            Zoomies removes the transportation barrier between you and more
            bookings.
          </p>
        </div>

        <div className={styles.grid}>
          {benefits.map((b, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.iconBox}>{b.icon}</div>
              <h3 className={styles.cardTitle}>{b.title}</h3>
              <p className={styles.cardDesc}>{b.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.ctaWrap}>
          <Link href="/groomer-onboarding" className={styles.cta}>
            Grooming Shops Partner With Us
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
