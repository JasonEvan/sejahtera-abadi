import logger from "@/lib/logger";
import db from "@/lib/prisma";
import { validate } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      logger.warn("PUT /api/barang/[id]: Invalid ID provided for stock update");
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const data = await request.json();
    const schema = z.object({
      nama_barang: z.string().min(1, "Nama Barang is required"),
      harga_barang: z.number().min(0, "Harga Barang must be a positive number"),
      jual_barang: z.number().min(0, "Harga Jual must be a positive number"),
      satuan_barang: z.string().min(1, "Satuan Barang is required"),
      modal: z.number().min(0, "Modal must be a positive number"),
    });

    const validatedData = validate(data, schema);

    await db.stock.update({
      where: { id },
      data: {
        nama_barang: validatedData.nama_barang,
        harga_barang: validatedData.harga_barang,
        jual_barang: validatedData.jual_barang,
        satuan_barang: validatedData.satuan_barang,
        modal: validatedData.modal,
      },
    });

    logger.info(`PUT /api/barang/${id}: Stock updated successfully.`);
    return NextResponse.json({ message: "Stock updated successfully" });
  } catch (error) {
    logger.error(
      `PUT /api/barang/[id] Error updating stock: ${
        error instanceof Error ? error.message : error
      }`
    );
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
