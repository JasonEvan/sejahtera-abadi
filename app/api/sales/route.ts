import { PrismaService } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const onlySalesName =
    request.nextUrl.searchParams.get("onlysalesname") === "true";
  const namaSales = request.nextUrl.searchParams.get("namasales");

  try {
    const prisma = PrismaService.getInstance();

    const whereClause = namaSales ? { nama_sales: namaSales } : {};

    const salesmen = await prisma.salesman.findMany({
      where: whereClause,
      ...(onlySalesName
        ? {
            select: {
              nama_sales: true,
            },
          }
        : undefined),
    });

    return NextResponse.json(
      { data: salesmen },
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
