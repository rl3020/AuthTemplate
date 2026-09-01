"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/session";
import type { SettingsActionState } from "@/lib/settings/types";

export async function updateDisplayName(
  _prevState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const user = await requireUser();
  const displayName = String(formData.get("displayName") ?? "").trim();

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName || null })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");
  return { error: null, success: true };
}
