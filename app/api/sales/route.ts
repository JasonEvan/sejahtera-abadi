import logger from "@/lib/logger";
import { PrismaService } from "@/lib/prisma";
import { validate } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

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

    logger.info(`GET /api/sales succeeded. Found ${salesmen.length} items.`);
    return NextResponse.json({ data: salesmen });
  } catch (error) {
    logger.error(
      `GET /api/sales failed: ${error instanceof Error ? error.message : error}`
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const schema = z.object({
      nama: z.string().min(1, "Nama salesman is required"),
      nomordepan: z.number().min(0, "Nomor depan cannot be negative"),
      telepon: z.string().nullable(),
      kode: z.string().min(1, "Kode is required"),
    });
    const validatedData = validate(body, schema);

    const prisma = PrismaService.getInstance();
    await prisma.salesman.create({
      data: {
        nama_sales: validatedData.nama,
        no_depan: validatedData.nomordepan,
        no_telp_sales: validatedData.telepon ? validatedData.telepon : null,
        kode_sales: validatedData.kode,
        no_nota: 0, // no_nota is initialized to 0
      },
    });

    logger.info(`POST /api/sales succeeded. Salesman added.`);
    return NextResponse.json(
      { message: "Salesman added successfully" },
      { status: 201 }
    );
  } catch (error) {
    logger.error(
      `POST /api/sales failed: ${
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
