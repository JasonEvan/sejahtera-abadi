import { PrismaService } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const prisma = PrismaService.getInstance();
    const data = await prisma.stock.findMany({
      select: {
        nama_barang: true,
        jual_barang: true,
        stock_akhir: true,
        modal: true,
        rusak_barang: true,
      },
    });

    return NextResponse.json({
      data,
    });
  } catch (error) {
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
