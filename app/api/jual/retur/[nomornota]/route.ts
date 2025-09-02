import { NotaI } from "@/hooks/useReturStore";
import logger from "@/lib/logger";
import { PrismaService } from "@/lib/prisma";
import { validate } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ nomornota: string }> }
) {
  try {
    const nomorNota = (await params).nomornota;
    const prisma = PrismaService.getInstance();
    const data = await prisma.jual.findMany({
      where: {
        nomor_nota: nomorNota,
      },
      select: {
        id: true,
        nama_barang: true,
        harga_barang: true,
        qty_barang: true,
        total_harga: true,
        diskon_nota: true,
        jretur: {
          select: {
            qty_barang: true,
          },
        },
      },
    });

    logger.info(
      `GET /api/jual/retur/${nomorNota} succeeded. Found ${data.length} items.`
    );
    return NextResponse.json({
      data: data.map((item) => {
        const totalRetur = item.jretur.reduce(
          (acc, curr) => acc + curr.qty_barang,
          0
        );

        return {
          id: item.id,
          nama_barang: item.nama_barang,
          harga_barang: item.harga_barang,
          qty_barang: item.qty_barang,
          retur_barang: totalRetur,
          total_harga: item.total_harga,
          diskon_nota: item.diskon_nota,
        };
      }),
    });
  } catch (error) {
    logger.error(
      `GET /api/jual/retur/[nomornota] failed: ${
        error instanceof Error ? error.message : error
      }`
    );
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ nomornota: string }> }
) {
  try {
    const nomorNota = (await params).nomornota;
    const body: { dataRetur: NotaI[] } = await request.json();

    const schema = z.object({
      dataRetur: z.array(
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
    });

    const validatedData = validate(body, schema);

    const prisma = PrismaService.getInstance();
    await prisma.$transaction(async (tx) => {
      // Get Old Jual Data
      const [oldJual, oldJnota, returLama] = await Promise.all([
        tx.jual.findFirstOrThrow({
          where: { nomor_nota: nomorNota },
          select: {
            tanggal_nota: true,
            nama_sales: true,
            id_client: true,
            jretur: {
              select: { tanggal_retur: true },
            },
          },
        }),
        tx.jnota.findUniqueOrThrow({
          where: { nomor_nota: nomorNota },
          select: { nilai_nota: true },
        }),
        tx.jretur.findMany({
          where: { nomor_nota: nomorNota },
          select: { nama_barang: true, qty_barang: true, tanggal_retur: true },
        }),
      ]);

      const oldStockUpdatePromises = returLama.map((item) =>
        tx.stock.update({
          where: { nama_barang: item.nama_barang },
          data: {
            stock_akhir: { decrement: item.qty_barang }, // Revert stock for retur jual
            qty_in: { decrement: item.qty_barang }, // Revert qty_in for retur jual
          },
        })
      );

      // Delete existing retur entries for the given nomorNota
      const jreturDeletePromise = tx.jretur.deleteMany({
        where: { nomor_nota: nomorNota },
      });

      await Promise.all([...oldStockUpdatePromises, jreturDeletePromise]);

      // Update jual with the new data
      const jualUpdatePromises = validatedData.dataRetur.map((item) =>
        tx.jual.update({
          where: { id: item.id },
          data: {
            qty_barang: item.qty_barang,
            total_harga: item.total_harga,
          },
        })
      );

      // Insert jretur again with the new retur data
      const retur = validatedData.dataRetur
        .filter((item) => item.retur_barang > 0)
        .map((item) => ({
          id_client: oldJual.id_client,
          id_jual: item.id,
          nomor_nota: nomorNota,
          tanggal_nota: oldJual.tanggal_nota,
          nama_barang: item.nama_barang,
          harga_barang: item.harga_barang,
          qty_barang: item.retur_barang,
          total_harga: item.harga_barang * item.retur_barang,
          tanggal_retur: returLama[0].tanggal_retur || new Date(),
          nama_sales: oldJual.nama_sales,
        }));

      const jreturCreatePromise = tx.jretur.createMany({
        data: retur,
      });

      const newStockUpdatePromises = retur.map((item) =>
        tx.stock.update({
          where: { nama_barang: item.nama_barang },
          data: {
            stock_akhir: { increment: item.qty_barang }, // Update stock for retur jual
            qty_in: { increment: item.qty_barang }, // Update qty_in for retur jual
          },
        })
      );

      // Update client sldakhir_piutang
      const newNilaiNota = validatedData.dataRetur.reduce(
        (acc, curr) => acc + curr.total_harga,
        0
      );
      const diskon = validatedData.dataRetur[0].diskon_nota || 0;
      const totalAkhir = newNilaiNota - (newNilaiNota * diskon) / 100;

      const clientUpdatePromise = tx.client.update({
        where: { id: oldJual.id_client },
        data: {
          sldakhir_piutang: {
            increment: totalAkhir - oldJnota.nilai_nota,
          },
        },
      });

      // Update jnota with the new total
      const jnotaUpdatePromise = tx.jnota.update({
        where: { nomor_nota: nomorNota },
        data: {
          nilai_nota: totalAkhir,
          saldo_nota: totalAkhir,
        },
      });

      await Promise.all([
        ...jualUpdatePromises,
        jreturCreatePromise,
        ...newStockUpdatePromises,
        clientUpdatePromise,
        jnotaUpdatePromise,
      ]);
    });

    return NextResponse.json({ message: "Retur updated successfully" });
  } catch (error) {
    console.error("Error updating retur data:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
