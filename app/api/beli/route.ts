import { PrismaService } from "@/lib/prisma";
import { BeliDTO } from "@/lib/types";
import { validate } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(request: NextRequest) {
  try {
    const data: BeliDTO = await request.json();

    const schema = z.object({
      namaClient: z.string(),
      nomorNota: z.string(),
      tanggalNota: z.string(),
      kotaClient: z.string(),
      dataPembelian: z.array(
        z.object({
          id: z.number(),
          namaBarang: z.string(),
          hargaBeli: z.number(),
          hargaJual: z.number(),
          jumlah: z.number(),
          subtotal: z.number(),
        })
      ),
      totalPembelian: z.number(),
      diskon: z.number(),
      totalAkhir: z.number(),
    });

    const validatedData = validate(data, schema);

    // prisma transaction logic here
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

      // Insert bnota
      await tx.bnota.create({
        data: {
          nomor_nota: validatedData.nomorNota,
          tanggal_nota: new Date(validatedData.tanggalNota),
          nilai_nota: validatedData.totalAkhir,
          diskon_nota: validatedData.diskon,
          lunas_nota: 0,
          diskon_lunas: 0,
          saldo_nota: validatedData.totalAkhir,
          id_client: client.id,
        },
      });

      // Mapping dataPembelian
      const mappedDataPembelian = validatedData.dataPembelian.map((item) => ({
        nomor_nota: validatedData.nomorNota,
        tanggal_nota: new Date(validatedData.tanggalNota),
        nama_barang: item.namaBarang,
        harga_barang: item.hargaBeli,
        qty_barang: item.jumlah,
        total_harga: item.subtotal,
        diskon_nota: validatedData.diskon,
        id_client: client.id,
      }));

      // Insert beli
      await tx.beli.createMany({
        data: mappedDataPembelian,
      });

      // Increment stock_akhir, Increment qty_in, Update harga_barang (harga beli)
      for (const item of validatedData.dataPembelian) {
        await tx.stock.update({
          where: {
            nama_barang: item.namaBarang,
          },
          data: {
            stock_akhir: {
              increment: item.jumlah,
            },
            qty_in: {
              increment: item.jumlah,
            },
            harga_barang: item.hargaBeli,
          },
        });
      }

      // Increment sldakhir_utang on client table
      await tx.client.update({
        where: {
          id: client.id,
        },
        data: {
          sldakhir_utang: {
            increment: validatedData.totalAkhir,
          },
        },
      });
    });

    return NextResponse.json(
      { message: "Data successfully saved" },
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
