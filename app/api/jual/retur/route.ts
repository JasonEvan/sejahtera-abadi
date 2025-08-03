import { PrismaService } from "@/lib/prisma";
import { ReturDTO } from "@/lib/types";
import { validate } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

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

    const prisma = PrismaService.getInstance();
    await prisma.$transaction(async (tx) => {
      // [1] Get Client ID
      const client = await tx.client.findUnique({
        where: {
          nama_client_kota_client: {
            nama_client: validatedData.namaClient,
            kota_client: validatedData.kotaClient,
          },
        },
      });

      if (!client) throw new Error("Client not found");

      // [2] Get data nota lama
      const notaLama = await tx.jnota.findFirst({
        where: {
          nomor_nota: validatedData.nomorNota,
        },
        select: {
          tanggal_nota: true,
          nilai_nota: true,
        },
      });

      if (!notaLama) throw new Error("Nota not found");

      // [3] Proses retur untuk setiap item
      for (const item of validatedData.dataNota) {
        if (item.retur_barang > 0) {
          // [3a] Dapatkan record jual asli
          const jualAsli = await tx.jual.findUnique({
            where: { id: item.id },
            select: { qty_barang: true, harga_barang: true, nama_sales: true },
          });

          if (!jualAsli)
            throw new Error(`Record jual dengan ID ${item.id} tidak ditemukan`);

          // [3b] Update qty pada record asli (dikurangi retur)
          const qtyBaru = jualAsli.qty_barang - item.retur_barang;

          await tx.jual.update({
            where: { id: item.id },
            data: {
              qty_barang: qtyBaru,
              total_harga: qtyBaru * jualAsli.harga_barang,
            },
          });

          // [3c] Buat record retur
          await tx.jretur.create({
            data: {
              nomor_nota: validatedData.nomorNota,
              tanggal_nota: new Date(notaLama.tanggal_nota),
              nama_barang: item.nama_barang,
              harga_barang: item.harga_barang,
              qty_barang: item.retur_barang,
              total_harga: item.harga_barang * item.retur_barang,
              tanggal_retur: new Date(validatedData.tanggal),
              id_client: client.id,
              id_jual: item.id,
              nama_sales: jualAsli.nama_sales,
            },
          });
        }
      }

      // [4] Update nilai nota
      await tx.jnota.update({
        where: {
          nomor_nota: validatedData.nomorNota,
        },
        data: {
          nilai_nota: validatedData.totalAkhir,
          saldo_nota: validatedData.totalAkhir,
        },
      });

      // [5] Update saldo piutang client
      await tx.client.update({
        where: {
          id: client.id,
        },
        data: {
          sldakhir_piutang: {
            increment: validatedData.totalAkhir - notaLama.nilai_nota,
          },
        },
      });
    });

    return NextResponse.json(
      { message: "Retur berhasil diproses" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing retur:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
