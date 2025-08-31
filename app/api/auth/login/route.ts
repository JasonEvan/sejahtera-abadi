import logger from "@/lib/logger";
import { PrismaService } from "@/lib/prisma";
import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      logger.warn("POST /api/auth/login failed: Missing email or password");
      return NextResponse.json(
        {
          error: "Missing email and password properties",
        },
        { status: 400 }
      );
    }

    const encodedPassword = btoa(password);

    const prisma = PrismaService.getInstance();
    const user = await prisma.user.findFirst({
      where: {
        email,
        password: encodedPassword,
      },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const token = await new SignJWT({
      email: user.email,
      id: user.id,
      password: user.password,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(secret);

    const response = NextResponse.json({ message: "Login successful" });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 2 * 60 * 60, // 2 hours
      path: "/", // Accessible throughout the site
      sameSite: "lax", // CSRF protection
    });

    logger.info(`POST /api/auth/login succeeded. User ID: ${user.id}`);
    return response;
  } catch (error) {
    logger.error(
      `POST /api/auth/login failed: ${
        error instanceof Error ? error.message : error
      }`
    );

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
