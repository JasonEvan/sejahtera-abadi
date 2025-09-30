import logger from "@/lib/logger";
import db from "@/lib/prisma";
import { TambahBarangFormValues } from "@/lib/types";
import { validate } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET() {
  try {
    const stocks = await db.stock.findMany({
      orderBy: {
        nama_barang: "asc",
      },
    });

    logger.info(`GET /api/barang succeeded. Found ${stocks.length} items.`);
    return NextResponse.json({ data: stocks });
  } catch (error) {
    logger.error(
      `GET /api/barang failed: ${
        error instanceof Error ? error.message : error
      }`
    );
    return NextResponse.json(
      {
        message: "Failed to fetch stocks",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body: TambahBarangFormValues = await request.json();

    // Validate the incoming data using Zod
    const zodSchema = z.object({
      nama: z.string().min(1, "Nama barang is required"),
      satuan: z.string().min(1, "Satuan is required"),
      stockawal: z.number().min(0, "Stock awal cannot be negative"),
      modal: z.number().min(0, "Modal cannot be negative"),
      hargabeli: z.number().min(0, "Harga beli cannot be negative"),
      hargajual: z.number().min(0, "Harga jual cannot be negative").nullable(),
    });
    const validatedData = validate(body, zodSchema);

    // Create a new PrismaService instance
    const result = await db.stock.create({
      data: {
        nama_barang: validatedData.nama,
        satuan_barang: validatedData.satuan,
        stock_awal: validatedData.stockawal,
        stock_akhir: validatedData.stockawal,
        modal: validatedData.modal,
        harga_barang: validatedData.hargabeli,
        jual_barang: validatedData.hargajual ? validatedData.hargajual : null, // Handle optional field
      },
    });

    logger.info(
      `POST /api/barang succeeded. Added barang: ${validatedData.nama}`
    );
    return NextResponse.json(
      { message: "Barang added successfully", data: result },
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    logger.error(
      `POST /api/barang failed: ${
        error instanceof Error ? error.message : error
      }`
    );
    return NextResponse.json(
      {
        message: "Failed to add barang",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
