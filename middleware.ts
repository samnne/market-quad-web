// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "./supabase/authHelper";
const PUBLIC_ROUTES = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/listings/search",
];

const INJECTION_PATTERNS = [
  /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
  /((\%3C)|<)((\%2F)|\/)*[a-z0-9\%]+((\%3E)|>)/i,
  /union[\s\+]+select/i,
  /exec(\s|\+)+(s|x)p\w+/i,
  /javascript:/i,
];

// decodeURIComponent throws on malformed input (e.g. "%E0%A4%A"), which would 500
const safeDecode = (val: string) => {
  try {
    return decodeURIComponent(val);
  } catch {
    return val;
  }
};

const isSuspicious = (val: string) =>
  INJECTION_PATTERNS.some((pattern) => pattern.test(safeDecode(val)));

const unauthorized = (message: string) =>
  NextResponse.json({ error: "Unauthorized", message }, { status: 401 });

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Block suspicious URL paths
  if (isSuspicious(pathname)) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  // Block suspicious query params
  for (const [, value] of searchParams.entries()) {
    if (isSuspicious(value)) {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }
  }

  // Never trust a client-supplied x-user-id, including on public routes
  const requestHeaders = new Headers(req.headers);
  requestHeaders.delete("x-user-id");

  // Skip public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Only protect /api routes
  if (!pathname.startsWith("/api")) return NextResponse.next();

  // Parse "Authorization: Bearer <access_token>"
  const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  // ...inside middleware, replacing the auth check:
  const authHeader = req.headers.get("authorization") ?? "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme?.toLowerCase() === "bearer" && token) {
    // New clients: verified JWT
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return unauthorized("Invalid or expired token");
    requestHeaders.set("x-user-id", data.user.id);
  } else if (UUID_REGEX.test(authHeader)) {
    // LEGACY (old app versions): remove after cutoff
    console.warn("legacy-auth", pathname);
    requestHeaders.set("x-user-id", authHeader.toLowerCase());
  } else {
    return unauthorized("Missing or malformed Authorization header");
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/api/:path*"],
};
