import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  display_name: string | null;
};

// cache() dedupes within a single request — if a layout and a page both
// need the profile, the query runs once. Mirrors getUser() in
// lib/auth/session.ts.
export const getProfile = cache(async (userId: string): Promise<Profile | null> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, display_name")
    .eq("id", userId)
    .single();
  return data;
});
