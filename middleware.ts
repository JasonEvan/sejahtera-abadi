import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return new TextEncoder().encode(secret);
}

const PUBLIC_PATHS = ["/", "/api/auth/login"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Helper to check if the request is for an API route
  const isAPIRequest = pathname.startsWith("/api");

  if (!token) {
    // If no token is found and the request is for a public path, allow it
    if (PUBLIC_PATHS.includes(pathname)) {
      return NextResponse.next();
    }

    // If no token is found and it's an API request, respond with 401
    if (isAPIRequest) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // If no token is found and it's not an API request, redirect to login
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // Verify the token using jwtVerify from jose
    await jwtVerify(token, getSecretKey());

    // If token is valid and user is trying to access the login page, redirect to dashboard
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // If verification is successful, proceed to the next middleware or route handler
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error: ", error);

    // If verification fails,
    // respond with 401 for API requests or redirect to login for others
    const response = isAPIRequest
      ? NextResponse.json({ error: "Invalid Token" }, { status: 401 })
      : NextResponse.redirect(new URL("/", request.url));

    // Clear the invalid token cookie
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/api/:path*"],
};
