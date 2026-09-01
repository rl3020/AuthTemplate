"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { type EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site";
import type { AuthActionState } from "@/lib/auth/types";

function readCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  return { email, password };
}

export async function signUp(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const { email, password } = readCredentials(formData);
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  if (!email || !password) {
    return { error: "Email and password are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getSiteUrl()}/auth/confirm`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // With email confirmations disabled (the local dev default), signUp
  // returns a session immediately — there's no email to check.
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/dashboard");
  }

  redirect("/auth/sign-up/check-email");
}

export async function signIn(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const { email, password } = readCredentials(formData);
  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Server Components cache the previous (logged-out) render; revalidate
  // the whole tree so pages that read the session pick up the new user.
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/auth/login");
}

// Consumes the token from an email confirmation link. Deliberately requires
// a real form submit rather than firing on GET: mail scanners (Microsoft
// Defender, Proofpoint, etc.) prefetch every link in an email, which would
// silently consume a token-in-URL confirmation before the user ever opens
// the message. Gating the actual verifyOtp call behind a click means only a
// human triggers it.
export async function confirmEmail(formData: FormData) {
  const token_hash = String(formData.get("token_hash") ?? "");
  const type = formData.get("type") as EmailOtpType | null;
  const next = String(formData.get("next") || "/dashboard");

  if (!token_hash || !type) {
    redirect("/auth/error?error=Missing confirmation token.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ type, token_hash });

  if (error) {
    redirect(`/auth/error?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect(next);
}
