import logger from "@/lib/logger";
import { PrismaService } from "@/lib/prisma";
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
      logger.warn(`PUT /api/client/${id} failed: Invalid ID`);
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const data = await request.json();
    const schema = z.object({
      nama_client: z.string().min(1, "Nama client is required"),
      kota_client: z.string(),
      alamat_client: z.string(),
      telp_client: z.string(),
      hp_client: z.string(),
    });

    const validatedData = validate(data, schema);

    const prisma = PrismaService.getInstance();
    await prisma.client.update({
      where: { id },
      data: {
        nama_client: validatedData.nama_client,
        kota_client: validatedData.kota_client,
        alamat_client: validatedData.alamat_client,
        telp_client: validatedData.telp_client,
        hp_client: validatedData.hp_client,
      },
    });

    logger.info(
      `PUT /api/client/${id} succeeded. Client updated successfully.`
    );
    return NextResponse.json({ message: "Client updated successfully" });
  } catch (error) {
    logger.error(
      `PUT /api/client/[id] failed: ${
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
