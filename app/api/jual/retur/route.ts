import { jual } from "@/app/generated/prisma";
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
    const data = await db.jretur.findMany({
      where: {
        nota: {
          lunas_nota: forMenu ? 0 : undefined,
        },
      },
      select,
      distinct: forMenu ? ["nomor_nota"] : undefined,
    });

    logger.info(`GET /api/jual/retur succeeded. Found ${data.length} items.`);
    return NextResponse.json({ data });
  } catch (error) {
    logger.error(
      `GET /api/jual/retur failed: ${
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
      const jualIds = dataToProcess.map((item) => item.id);
      const [client, notaLama, jualAsli] = await Promise.all([
        tx.client.findUnique({
          where: {
            nama_client_kota_client: {
              nama_client: validatedData.namaClient,
              kota_client: validatedData.kotaClient,
            },
          },
        }),
        tx.jnota.findFirst({
          where: { nomor_nota: validatedData.nomorNota },
          select: {
            tanggal_nota: true,
            nilai_nota: true,
          },
        }),
        tx.jual.findMany({
          where: { id: { in: jualIds } },
        }),
      ]);

      if (!client) throw new Error("Client not found");
      if (!notaLama) throw new Error("Nota not found");

      // [2] Validation and preparation
      const jualAsliMap = new Map<number, jual>(
        jualAsli.map((item) => [item.id, item])
      );

      for (const item of dataToProcess) {
        const originalJual = jualAsliMap.get(item.id);
        if (!originalJual) {
          throw new Error(`Record jual dengan ID ${item.id} tidak ditemukan`);
        }

        if (item.retur_barang > originalJual.qty_barang) {
          throw new Error(
            `Jumlah retur untuk barang ${item.nama_barang} melebihi jumlah jual asli`
          );
        }
      }

      // [3] Proses retur for each item
      const jreturCreateData = dataToProcess.map((item) => ({
        nomor_nota: validatedData.nomorNota,
        tanggal_nota: notaLama.tanggal_nota,
        nama_barang: item.nama_barang,
        harga_barang: item.harga_barang,
        qty_barang: item.retur_barang,
        total_harga: item.harga_barang * item.retur_barang,
        tanggal_retur: new Date(validatedData.tanggal),
        id_client: client.id,
        id_jual: item.id,
        nama_sales: jualAsliMap.get(item.id)!.nama_sales,
      }));

      const jreturCreatePromise = tx.jretur.createMany({
        data: jreturCreateData,
      });

      const jualUpdatePromises = dataToProcess.map((item) => {
        const originalJual = jualAsliMap.get(item.id)!;
        const qtyBaru = originalJual.qty_barang - item.retur_barang;
        return tx.jual.update({
          where: { id: item.id },
          data: {
            qty_barang: qtyBaru,
            total_harga: qtyBaru * originalJual.harga_barang,
          },
        });
      });

      const stockUpdatePromises = dataToProcess.map((item) =>
        tx.stock.update({
          where: { nama_barang: item.nama_barang },
          data: {
            stock_akhir: { increment: item.retur_barang },
            qty_in: { increment: item.retur_barang },
          },
        })
      );

      // [4] Update nilai nota
      const jnotaUpdatePromise = tx.jnota.update({
        where: { nomor_nota: validatedData.nomorNota },
        data: {
          nilai_nota: validatedData.totalAkhir,
          saldo_nota: validatedData.totalAkhir,
        },
      });

      // [5] Update saldo piutang client
      const clientUpdatePromise = tx.client.update({
        where: { id: client.id },
        data: {
          sldakhir_piutang: {
            increment: validatedData.totalAkhir - notaLama.nilai_nota,
          },
        },
      });

      await Promise.all([
        jreturCreatePromise,
        ...jualUpdatePromises,
        ...stockUpdatePromises,
        jnotaUpdatePromise,
        clientUpdatePromise,
      ]);
    });

    logger.info(`POST /api/jual/retur succeeded. Retur processed.`);
    return NextResponse.json(
      { message: "Retur berhasil diproses" },
      { status: 200 }
    );
  } catch (error) {
    logger.error(
      `POST /api/jual/retur failed: ${
        error instanceof Error ? error.message : error
      }`
    );
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
