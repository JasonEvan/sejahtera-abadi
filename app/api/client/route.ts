import logger from "@/lib/logger";
import db from "@/lib/prisma";
import { validate } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(request: NextRequest) {
  // if the query params contain onlyclientsname, return only the client names
  const onlyClientsName =
    request.nextUrl.searchParams.get("onlyclientsname") === "true";

  try {
    const clients = await db.client.findMany(
      onlyClientsName
        ? { select: { nama_client: true, kota_client: true } }
        : undefined
    );

    logger.info(`GET /api/client succeeded. Found ${clients.length} items.`);
    return NextResponse.json(
      { data: clients },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    logger.error(
      `GET /api/client failed: ${
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
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Define Zod schema for validation
    const schema = z.object({
      nama: z.string().min(1, "Nama client is required"),
      kota: z.string().nullable(),
      alamat: z.string().nullable(),
      telepon: z.string().nullable(),
      handphone: z.string().nullable(),
    });
    const validatedData = validate(body, schema);

    await db.client.create({
      data: {
        nama_client: validatedData.nama,
        kota_client: validatedData.kota ? validatedData.kota : "",
        alamat_client: validatedData.alamat ? validatedData.alamat : null,
        telp_client: validatedData.telepon ? validatedData.telepon : null,
        hp_client: validatedData.handphone ? validatedData.handphone : null,
      },
    });

    logger.info(`POST /api/client succeeded. Client added successfully.`);
    return NextResponse.json(
      { message: "Client added successfully" },
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    logger.error(
      `POST /api/client failed: ${
        error instanceof Error ? error.message : error
      }`
    );
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
