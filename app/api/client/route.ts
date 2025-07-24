import { PrismaService } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // if the query params contain onlyclientsname, return only the client names
  const onlyClientsName =
    request.nextUrl.searchParams.get("onlyclientsname") === "true";

  try {
    const prisma = PrismaService.getInstance();
    const clients = await prisma.client.findMany(
      onlyClientsName ? { select: { nama_client: true } } : undefined
    );

    return NextResponse.json(
      { data: clients },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
