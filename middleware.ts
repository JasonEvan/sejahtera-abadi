import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    if (request.nextUrl.pathname === "/") {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // Verify the token using jwtVerify from jose
    await jwtVerify(token, getSecretKey());

    // If token is valid and user is trying to access the login page, redirect to dashboard
    if (request.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // If verification is successful, proceed to the next middleware or route handler
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error: ", error);
    // If verification fails, redirect to the login page
    const response = NextResponse.redirect(new URL("/", request.url));

    // Clear the invalid token cookie
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
