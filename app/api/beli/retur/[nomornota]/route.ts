import { NotaI } from "@/hooks/useReturStore";
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
    const data = await prisma.beli.findMany({
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
        bretur: {
          select: {
            qty_barang: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: data.map((item) => {
        const totalRetur = item.bretur.reduce(
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
    console.error("Error fetching retur data:", error);
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
      // Get Old Beli Data
      const oldBeli = await tx.beli.findFirstOrThrow({
        where: {
          nomor_nota: nomorNota,
        },
        select: {
          tanggal_nota: true,
          id_client: true,
          bretur: {
            select: {
              tanggal_retur: true,
            },
          },
        },
      });

      const oldBnota = await tx.bnota.findUniqueOrThrow({
        where: {
          nomor_nota: nomorNota,
        },
        select: {
          nilai_nota: true,
        },
      });

      const returAsli = await tx.bretur.findFirst({
        where: { nomor_nota: nomorNota },
        select: { tanggal_retur: true },
      });

      const returLama = await tx.bretur.findMany({
        where: { nomor_nota: nomorNota },
        select: { nama_barang: true, qty_barang: true },
      });

      await Promise.all(
        returLama.map((item) =>
          tx.stock.update({
            where: { nama_barang: item.nama_barang },
            data: {
              stock_akhir: { increment: item.qty_barang }, // Revert stock for retur beli
              qty_out: { decrement: item.qty_barang }, // Revert qty_out for retur beli
            },
          })
        )
      );

      // Delete existing retur entries for the given nomorNota
      await tx.bretur.deleteMany({
        where: {
          nomor_nota: nomorNota,
        },
      });

      // Update beli with the new data
      await Promise.all(
        validatedData.dataRetur.map((item) =>
          tx.beli.update({
            where: { id: item.id },
            data: {
              qty_barang: item.qty_barang,
              total_harga: item.total_harga,
            },
          })
        )
      );

      // Insert bretur again with the new retur data
      const retur = validatedData.dataRetur
        .filter((item) => item.retur_barang > 0)
        .map((item) => ({
          id_client: oldBeli.id_client,
          id_beli: item.id,
          nomor_nota: nomorNota,
          tanggal_nota: oldBeli.tanggal_nota,
          nama_barang: item.nama_barang,
          harga_barang: item.harga_barang,
          qty_barang: item.retur_barang,
          total_harga: item.harga_barang * item.retur_barang,
          tanggal_retur: returAsli?.tanggal_retur || new Date(),
        }));

      await tx.bretur.createMany({
        data: retur,
      });

      await Promise.all(
        retur.map((item) =>
          tx.stock.update({
            where: { nama_barang: item.nama_barang },
            data: {
              stock_akhir: { decrement: item.qty_barang }, // Update stock for retur beli
              qty_out: { increment: item.qty_barang }, // Update qty_out for retur beli
            },
          })
        )
      );

      // Update client sldakhir_utang
      const newNilaiNota = validatedData.dataRetur.reduce(
        (acc, curr) => acc + curr.total_harga,
        0
      );
      const diskon = validatedData.dataRetur[0].diskon_nota || 0;
      const totalAkhir = newNilaiNota - (newNilaiNota * diskon) / 100;

      await tx.client.update({
        where: {
          id: oldBeli.id_client,
        },
        data: {
          sldakhir_utang: {
            increment: totalAkhir - oldBnota.nilai_nota,
          },
        },
      });

      // Update bnota with the new total
      await tx.bnota.update({
        where: {
          nomor_nota: nomorNota,
        },
        data: {
          nilai_nota: totalAkhir,
          saldo_nota: totalAkhir,
        },
      });
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
