import { PrismaService } from "@/lib/prisma";
import { JualDTO } from "@/lib/types";
import { validate } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(request: NextRequest) {
  try {
    const data: JualDTO = await request.json();

    const schema = z.object({
      namaLangganan: z.string(),
      namaSales: z.string(),
      nomorNota: z.string(),
      tanggalNota: z.string(),
      kotaClient: z.string(),
      dataPenjualan: z.array(
        z.object({
          id: z.number(),
          namaBarang: z.string(),
          jumlah: z.number(),
          modal: z.number(),
          hargaSatuan: z.number(),
          subtotal: z.number(),
        })
      ),
      totalPenjualan: z.number(),
      diskon: z.number(),
      totalAkhir: z.number(),
    });

    const validatedData = validate(data, schema);

    const prisma = PrismaService.getInstance();
    await prisma.$transaction(async (tx) => {
      // Get ID client
      const client = await tx.client.findUnique({
        where: {
          nama_client_kota_client: {
            nama_client: validatedData.namaLangganan,
            kota_client: validatedData.kotaClient,
          },
        },
      });

      if (!client) {
        throw new Error("Client not found");
      }

      // Insert jnota
      await tx.jnota.create({
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

      // Mapping dataPenjualan
      const mappedData = validatedData.dataPenjualan.map((item) => ({
        nomor_nota: validatedData.nomorNota,
        tanggal_nota: new Date(validatedData.tanggalNota),
        nama_barang: item.namaBarang,
        harga_barang: item.hargaSatuan,
        qty_barang: item.jumlah,
        total_harga: item.subtotal,
        diskon_nota: validatedData.diskon,
        id_client: client.id,
        nama_sales: validatedData.namaSales,
      }));

      // Insert jual
      await tx.jual.createMany({
        data: mappedData,
      });

      for (const item of validatedData.dataPenjualan) {
        // Decrement stock and increment qty_out
        await tx.stock.update({
          where: {
            nama_barang: item.namaBarang,
          },
          data: {
            stock_akhir: {
              decrement: item.jumlah,
            },
            qty_out: {
              increment: item.jumlah,
            },
          },
        });
      }

      // Increment note number on sales table
      await tx.salesman.update({
        where: {
          nama_sales: validatedData.namaSales,
        },
        data: {
          no_nota: {
            increment: 1,
          },
        },
      });

      // Increment sldakhir_piutang on client table
      await tx.client.update({
        where: {
          id: client.id,
        },
        data: {
          sldakhir_piutang: {
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
