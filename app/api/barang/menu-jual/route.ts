import logger from "@/lib/logger";
import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await db.stock.findMany({
      select: {
        nama_barang: true,
        jual_barang: true,
        stock_akhir: true,
        modal: true,
        rusak_barang: true,
      },
      orderBy: {
        nama_barang: "asc",
      },
    });

    logger.info(
      `GET /api/stock/menu-jual succeeded. Found ${data.length} items.`
    );
    return NextResponse.json({
      data,
    });
  } catch (error) {
    logger.error(
      `GET /api/stock/menu-jual failed: ${
        error instanceof Error ? error.message : error
      }`
    );
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
