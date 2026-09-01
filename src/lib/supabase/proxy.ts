import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Every path is private by default — this is a UX redirect only, it makes
// the app *feel* protected. It is not the security boundary: a Server
// Action reachable from an excluded path bypasses it entirely, so every
// Server Action and Server Component that touches private data must check
// auth itself, and every table must have RLS enabled. Add a new private
// page and there's nothing to update here; every auth route already lives
// under /auth/, so a new one there is automatically public too.
function isPublicPath(pathname: string) {
  return pathname === "/" || pathname.startsWith("/auth/");
}

// Signed-in users shouldn't see the login/sign-up forms again.
const AUTH_ENTRY_PREFIXES = ["/auth/login", "/auth/sign-up"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAuthEntry = AUTH_ENTRY_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (!user && !isPublicPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user && isAuthEntry) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
