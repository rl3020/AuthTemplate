import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

// cache() dedupes within a single request/render — if a layout and a page
// both call getUser(), Supabase's Auth server is hit once, not twice.
// It does NOT persist across requests; auth is still re-checked every time.
export const getUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

// Use in any Server Component that requires a signed-in user. Redirects to
// /login (optionally with ?next=<path>) if there's no session.
//
// This is defense-in-depth: the proxy already redirects signed-out visitors
// away from protected routes as a UX convenience, but that's not the
// security boundary and can be bypassed. This is the real check.
export async function requireUser(next?: string): Promise<User> {
  const user = await getUser();
  if (!user) {
    redirect(next ? `/auth/login?next=${encodeURIComponent(next)}` : "/auth/login");
  }
  return user;
}
