import logger from "@/lib/logger";
import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0, // Expire the cookie immediately
    path: "/", // Accessible throughout the site
    sameSite: "lax", // CSRF protection
  });

  logger.info("GET /api/auth/logout succeeded. User logged out");
  return response;
}
