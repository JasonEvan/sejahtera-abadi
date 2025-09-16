import { beli } from "@/app/generated/prisma";
import logger from "@/lib/logger";
import db from "@/lib/prisma";
import { ReturDTO } from "@/lib/types";
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
    const data = await db.bretur.findMany({
      where: {
        nota: {
          lunas_nota: forMenu ? 0 : undefined,
        },
      },
      select,
      distinct: forMenu ? ["nomor_nota"] : undefined,
    });

    logger.info(`GET /api/beli/retur succeeded. Found ${data.length} items.`);
    return NextResponse.json({ data });
  } catch (error) {
    logger.error(
      `GET /api/beli/retur failed: ${
        error instanceof Error ? error.message : error
      }`
    );
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ReturDTO = await request.json();

    const schema = z.object({
      namaClient: z.string().min(1, "Nama client tidak boleh kosong"),
      kotaClient: z.string(),
      nomorNota: z.string().min(1, "Nomor nota tidak boleh kosong"),
      tanggal: z.string(),
      dataNota: z.array(
        z.object({
          id: z.number(),
          nama_barang: z.string(),
          harga_barang: z.number(),
          qty_barang: z.number(),
          retur_barang: z.number(),
          total_harga: z.number(),
          diskon_nota: z.number(),
        })
      ),
      diskon: z.number(),
      totalAkhir: z.number(),
      nilaiRetur: z.number(),
    });

    const validatedData = validate(body, schema);

    const dataToProcess = validatedData.dataNota.filter(
      (item) => item.retur_barang > 0
    );

    if (dataToProcess.length === 0) {
      throw new Error("Tidak ada barang yang diretur.");
    }

    await db.$transaction(async (tx) => {
      // [1] Get Client ID and data nota lama
      const beliIds = dataToProcess.map((item) => item.id);
      const [client, notaLama, beliAsli] = await Promise.all([
        tx.client.findUnique({
          where: {
            nama_client_kota_client: {
              nama_client: validatedData.namaClient,
              kota_client: validatedData.kotaClient,
            },
          },
        }),
        tx.bnota.findFirst({
          where: { nomor_nota: validatedData.nomorNota },
          select: {
            tanggal_nota: true,
            nilai_nota: true,
          },
        }),
        tx.beli.findMany({
          where: { id: { in: beliIds } },
        }),
      ]);

      if (!client) throw new Error("Client not found");
      if (!notaLama) throw new Error("Nota not found");

      // [2] Validation and preparation
      const beliAsliMap = new Map<number, beli>(
        beliAsli.map((item) => [item.id, item])
      );

      for (const item of dataToProcess) {
        const originalbeli = beliAsliMap.get(item.id);
        if (!originalbeli) {
          throw new Error(`Record beli dengan ID ${item.id} tidak ditemukan`);
        }

        if (item.retur_barang > originalbeli.qty_barang) {
          throw new Error(
            `Jumlah retur untuk barang ${item.nama_barang} melebihi jumlah beli asli`
          );
        }
      }

      // [3] Process each retur item
      const breturCreateData = dataToProcess.map((item) => ({
        nomor_nota: validatedData.nomorNota,
        tanggal_nota: notaLama.tanggal_nota,
        nama_barang: item.nama_barang,
        harga_barang: item.harga_barang,
        qty_barang: item.retur_barang,
        total_harga: item.harga_barang * item.retur_barang,
        tanggal_retur: new Date(validatedData.tanggal),
        id_client: client.id,
        id_beli: item.id,
      }));

      const breturCreatePromise = tx.bretur.createMany({
        data: breturCreateData,
      });

      const beliUpdatePromises = dataToProcess.map((item) => {
        const originalBeli = beliAsliMap.get(item.id)!;
        const qtyBaru = originalBeli.qty_barang - item.retur_barang;
        return tx.beli.update({
          where: { id: item.id },
          data: {
            qty_barang: qtyBaru,
            total_harga: qtyBaru * originalBeli.harga_barang,
          },
        });
      });

      const stockUpdatePromises = dataToProcess.map((item) =>
        tx.stock.update({
          where: { nama_barang: item.nama_barang },
          data: {
            stock_akhir: { decrement: item.retur_barang },
            qty_out: { increment: item.retur_barang },
          },
        })
      );

      // [4] Update nilai nota
      const bnotaUpdatePromise = tx.bnota.update({
        where: { nomor_nota: validatedData.nomorNota },
        data: {
          nilai_nota: validatedData.totalAkhir,
          saldo_nota: validatedData.totalAkhir,
        },
      });

      // [5] Update saldo utang client
      const clientUpdatePromise = tx.client.update({
        where: { id: client.id },
        data: {
          sldakhir_utang: {
            increment: validatedData.totalAkhir - notaLama.nilai_nota,
          },
        },
      });

      await Promise.all([
        breturCreatePromise,
        ...beliUpdatePromises,
        ...stockUpdatePromises,
        bnotaUpdatePromise,
        clientUpdatePromise,
      ]);
    });

    logger.info(`POST /api/beli/retur succeeded. Retur processed.`);
    return NextResponse.json(
      { message: "Retur berhasil diproses" },
      { status: 200 }
    );
  } catch (error) {
    logger.error(
      `POST /api/beli/retur failed: ${
        error instanceof Error ? error.message : error
      }`
    );
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
