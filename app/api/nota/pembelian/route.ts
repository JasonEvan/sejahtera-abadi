import { PrismaService } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Check if the request has a query parameter for utang
    // This is used to filter the nota based on whether it is "utang" or not
    // If the parameter is present, it will only return where saldo is not 0
    const notLunasOnly = request.nextUrl.searchParams.get("utang") === "true";

    // Check if the request has a query parameter for menu
    // This is used to select only nomor and saldo nota if true
    const forMenu = request.nextUrl.searchParams.get("formenu") === "true";

    // Get nama and kota client from query parameters
    const namaClient = request.nextUrl.searchParams.get("nama") || "";
    const kotaClient = request.nextUrl.searchParams.get("kota") || "";

    const prisma = PrismaService.getInstance();
    const nota = await prisma.bnota.findMany({
      where: {
        // If notLunasOnly is true, filter where saldo is not 0
        saldo_nota: notLunasOnly ? { not: 0 } : undefined,
        // If namaClient and kotaClient are provided, filter by client
        // Otherwise, do not filter by client
        client: namaClient
          ? {
              nama_client: namaClient,
              kota_client: kotaClient,
            }
          : undefined,
      },
      select: forMenu ? { nomor_nota: true, saldo_nota: true } : undefined,
    });

    return NextResponse.json(
      { data: nota },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
