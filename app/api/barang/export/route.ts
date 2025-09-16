import logger from "@/lib/logger";
import db from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";

export async function POST(request: NextRequest) {
  try {
    const { columns }: { columns: string[] } = await request.json();

    const selectedColumns = columns.reduce(
      (acc: Record<string, boolean>, curr) => {
        acc[curr] = true;
        return acc;
      },
      {}
    );

    const data = await db.stock.findMany({
      select: selectedColumns,
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");
    worksheet.columns = Object.keys(data[0]).map((key) => ({
      header: key,
      key,
    }));
    worksheet.addRows(data);

    const buffer = await workbook.xlsx.writeBuffer();

    logger.info(
      `POST /api/barang/export succeeded. Exported columns: ${columns.join(
        ", "
      )}`
    );

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=stock.xlsx",
      },
    });
  } catch (error) {
    logger.error(
      `POST /api/barang/export failed: ${
        error instanceof Error ? error.message : error
      }`
    );

    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
