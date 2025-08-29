import logger from "@/lib/logger";
import { PrismaService } from "@/lib/prisma";
import { PelunasanDTO } from "@/lib/types";
import { validate } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(request: NextRequest) {
  const forMenu = request.nextUrl.searchParams.get("formenu") === "true";

  let select: Record<string, boolean> | undefined = undefined;
  if (forMenu) {
    select = {
      nomor_nota: true,
    };
  }

  try {
    const prisma = PrismaService.getInstance();
    const data = await prisma.blunas.findMany({
      select,
    });

    logger.info(
      `GET /api/pelunasan/utang succeeded. Found ${data.length} items.`
    );
    return NextResponse.json({ data });
  } catch (error) {
    logger.error(
      `GET /api/pelunasan/utang failed: ${
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

export async function POST(request: NextRequest) {
  try {
    const body: PelunasanDTO = await request.json();

    const schema = z.object({
      namaClient: z.string().min(1, "Nama client is required"),
      kotaClient: z.string(),
      nomorTransaksi: z.string().min(1, "Nomor transaksi is required"),
      tanggal: z.string(),
      dataPelunasan: z.array(
        z.object({
          id: z.number(),
          nomorNota: z.string().min(1, "Nomor nota is required"),
          saldoNota: z.number(),
          lunasNota: z.number(),
        })
      ),
    });

    const validatedData = validate(body, schema);

    const prisma = PrismaService.getInstance();
    await prisma.$transaction(async (tx) => {
      // Get ID client
      const client = await tx.client.findUnique({
        where: {
          nama_client_kota_client: {
            nama_client: validatedData.namaClient,
            kota_client: validatedData.kotaClient,
          },
        },
      });

      if (!client) {
        throw new Error("Client not found");
      }

      let totalLunas = 0;
      for (const item of validatedData.dataPelunasan) {
        totalLunas += item.lunasNota;

        // Update lunas_nota and saldo_nota di bnota
        await tx.bnota.update({
          where: { nomor_nota: item.nomorNota },
          data: {
            lunas_nota: {
              increment: item.lunasNota,
            },
            saldo_nota: {
              decrement: item.lunasNota,
            },
          },
        });

        // insert ke blunas
        await tx.blunas.create({
          data: {
            nomor_transaksi: validatedData.nomorTransaksi,
            tanggal_lunas: new Date(validatedData.tanggal),
            nomor_nota: item.nomorNota,
            lunas_nota: item.lunasNota,
            id_client: client.id,
          },
        });
      }

      // update sldakhir_utang di client
      await tx.client.update({
        where: { id: client.id },
        data: {
          sldakhir_utang: {
            decrement: totalLunas,
          },
        },
      });
    });

    logger.info(
      `POST /api/pelunasan/utang succeeded. Created payments for client ${validatedData.namaClient}.`
    );
    return NextResponse.json(
      { message: "Pelunasan berhasil diproses" },
      { status: 201 }
    );
  } catch (error) {
    logger.error(
      `POST /api/pelunasan/utang failed: ${
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
