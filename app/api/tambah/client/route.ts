import { PrismaService } from "@/lib/prisma";
import { validate } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

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

    const prisma = PrismaService.getInstance();
    await prisma.client.create({
      data: {
        nama_client: validatedData.nama,
        kota_client: validatedData.kota ? validatedData.kota : null,
        alamat_client: validatedData.alamat ? validatedData.alamat : null,
        telp_client: validatedData.telepon ? validatedData.telepon : null,
        hp_client: validatedData.handphone ? validatedData.handphone : null,
      },
    });

    return NextResponse.json(
      { message: "Client added successfully" },
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
