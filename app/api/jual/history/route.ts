import logger from "@/lib/logger";
import { PrismaService } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const namaBarang = request.nextUrl.searchParams.get("namaBarang") || "";
  const namaClient = request.nextUrl.searchParams.get("namaClient") || "";
  const kotaClient = request.nextUrl.searchParams.get("kotaClient") || "";
  try {
    const prisma = PrismaService.getInstance();

    const client = await prisma.client.findUniqueOrThrow({
      where: {
        nama_client_kota_client: {
          nama_client: namaClient,
          kota_client: kotaClient,
        },
      },
    });

    const data = await prisma.jual.findMany({
      where: {
        nama_barang: {
          contains: namaBarang,
        },
        id_client: client.id,
      },
      distinct: ["nama_barang", "harga_barang", "tanggal_nota"],
      select: {
        nama_barang: true,
        harga_barang: true,
        tanggal_nota: true,
      },
    });

    logger.info(`GET /api/jual/history succeeded. Found ${data.length} items.`);
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    logger.error(
      `GET /api/jual/history failed: ${
        error instanceof Error ? error.message : error
      }`
    );
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
