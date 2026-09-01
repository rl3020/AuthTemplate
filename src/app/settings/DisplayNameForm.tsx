"use client";

import { useActionState } from "react";
import { updateDisplayName } from "@/lib/settings/actions";
import { initialSettingsActionState } from "@/lib/settings/types";
import { SubmitButton } from "@/app/auth/components/SubmitButton";
import styles from "@/app/components/app.module.css";

export function DisplayNameForm({
  initialDisplayName,
}: {
  initialDisplayName: string;
}) {
  const [state, formAction, pending] = useActionState(
    updateDisplayName,
    initialSettingsActionState,
  );

  return (
    <form className={styles.form} action={formAction}>
      {state.error && <p className={styles.error}>{state.error}</p>}

      <div className={styles.field}>
        <label htmlFor="displayName">Display name</label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          defaultValue={initialDisplayName}
          maxLength={80}
        />
      </div>

      <SubmitButton pending={pending} label="Save" pendingLabel="Saving…" />

      {state.success && !pending && (
        <p aria-live="polite">Saved.</p>
      )}
    </form>
  );
}
