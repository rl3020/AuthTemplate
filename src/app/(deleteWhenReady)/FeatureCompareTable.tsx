// Part of the (deleteWhenReady) route group — delete the whole folder.

import styles from "@/app/(deleteWhenReady)/page.module.css";

type Variant = "yes" | "no";

type Row = {
  label: string;
  free: string;
  production: string;
  freeVariant?: Variant;
  productionVariant?: Variant;
};

const ROWS: Row[] = [
  {
    label: "Setup cost",
    free: "Supabase free tier — nothing else",
    production: "+ SMTP provider + a domain you own",
  },
  {
    label: "Email/password login",
    free: "✓",
    production: "✓",
    freeVariant: "yes",
    productionVariant: "yes",
  },
  {
    label: "Email confirmation",
    free: "off (recommended)",
    production: "✓ opt-in",
    freeVariant: "no",
    productionVariant: "yes",
  },
  {
    label: "Sessions & protected routes",
    free: "✓",
    production: "✓",
    freeVariant: "yes",
    productionVariant: "yes",
  },
  {
    label: "Row Level Security",
    free: "✓",
    production: "✓",
    freeVariant: "yes",
    productionVariant: "yes",
  },
  {
    label: "Settings page",
    free: "✓",
    production: "✓",
    freeVariant: "yes",
    productionVariant: "yes",
  },
  {
    label: "Forgot/reset password",
    free: "Not included",
    production: "✓",
    freeVariant: "no",
    productionVariant: "yes",
  },
  {
    label: "Dark mode",
    free: "✓",
    production: "✓",
    freeVariant: "yes",
    productionVariant: "yes",
  },
  {
    label: "CI-deployed migrations",
    free: "✓",
    production: "✓",
    freeVariant: "yes",
    productionVariant: "yes",
  },
  {
    label: "SMTP_CONFIGURED flag",
    free: "false (ships as-is)",
    production: "true (you flip it)",
  },
];

const VARIANT_CLASS: Record<Variant, string> = {
  yes: styles.compareYes,
  no: styles.compareNo,
};

function Cell({ value, variant }: { value: string; variant?: Variant }) {
  return <td className={variant && VARIANT_CLASS[variant]}>{value}</td>;
}

export function FeatureCompareTable() {
  return (
    <div className={styles.compareWrap}>
      <table className={styles.compareTable}>
        <colgroup>
          <col className={styles.compareColLabel} />
          <col />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" />
            <th scope="col">Free</th>
            <th scope="col" data-accent="secure">
              Production
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              <Cell value={row.free} variant={row.freeVariant} />
              <Cell value={row.production} variant={row.productionVariant} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
