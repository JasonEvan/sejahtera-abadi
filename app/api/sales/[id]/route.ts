import logger from "@/lib/logger";
import db from "@/lib/prisma";
import { validate } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      logger.warn(`PUT /api/sales/${id} failed: Invalid ID`);
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const data = await request.json();
    const schema = z.object({
      nama_sales: z.string().min(1, "Nama Salesman is required"),
      no_nota: z.number().min(0, "Nomer Nota must be a non-negative number"),
      no_telp_sales: z.string(),
      kode_sales: z.string(),
    });

    const validatedData = validate(data, schema);

    await db.salesman.update({
      where: { id },
      data: {
        nama_sales: validatedData.nama_sales,
        no_nota: validatedData.no_nota,
        no_telp_sales: validatedData.no_telp_sales,
        kode_sales: validatedData.kode_sales,
      },
    });

    logger.info(`PUT /api/sales/${id} succeeded. Salesman updated.`);
    return NextResponse.json({ message: "Salesman updated successfully" });
  } catch (error) {
    logger.error(
      `PUT /api/sales/[id] failed: ${
        error instanceof Error ? error.message : error
      }`,
    );
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      logger.warn(
        "DELETE /api/sales/[id]: Invalid ID provided for client deletion",
      );
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const salesman = await db.salesman.findUnique({
      where: { id },
    });

    if (!salesman) {
      logger.warn(`DELETE /api/sales/${id} failed: Salesman not found`);
      return NextResponse.json(
        { error: "Salesman not found" },
        { status: 404 },
      );
    }

    const hasJual = await db.jual.findFirst({
      where: { nama_sales: salesman.nama_sales },
    });

    const hasTransactions = Boolean(hasJual);

    if (hasTransactions) {
      logger.warn(
        `DELETE /api/sales/${id} failed: Salesman has associated transactions.`,
      );
      return NextResponse.json(
        {
          error:
            "Cannot delete salesman as it is associated with existing transactions.",
        },
        { status: 400 },
      );
    }

    await db.salesman.delete({
      where: { id },
    });

    logger.info(`DELETE /api/sales/${id} succeeded. Salesman deleted.`);
    return NextResponse.json({ message: "Salesman deleted successfully" });
  } catch (error) {
    logger.error(
      `DELETE /api/sales/[id] failed: ${
        error instanceof Error ? error.message : error
      }`,
    );
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
