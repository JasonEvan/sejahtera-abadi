import { PrismaService } from "@/lib/prisma";
import { BeliDTO, EditDTO } from "@/lib/types";
import { validate } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(request: NextRequest) {
  const nota = request.nextUrl.searchParams.get("nota") || undefined;

  try {
    const prisma = PrismaService.getInstance();
    const data = await prisma.beli.findMany({
      where: {
        nomor_nota: nota,
      },
      select: {
        id: true,
        nama_barang: true,
        harga_barang: true,
        qty_barang: true,
        total_harga: true,
        diskon_nota: true,
      },
    });

    return NextResponse.json(
      { data },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

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

export async function PUT(request: NextRequest) {
  try {
    const data: EditDTO = await request.json();
    const schema = z.object({
      namaClient: z.string(),
      kotaClient: z.string(),
      nomorNota: z.string(),
      dataNota: z.array(
        z.object({
          id: z.number(),
          nama_barang: z.string(),
          harga_barang: z.number(),
          qty_barang: z.number(),
          total_harga: z.number(),
          diskon_nota: z.number(),
        })
      ),
      nilaiNota: z.number(),
      diskonNota: z.number(),
      totalAkhir: z.number(),
    });

    const validatedData = validate(data, schema);

    const prisma = PrismaService.getInstance();
    await prisma.$transaction(async (tx) => {
      // [0] validate if nomorNota exists in bretur
      const bretur = await tx.bretur.findFirst({
        where: {
          nomor_nota: validatedData.nomorNota,
        },
      });

      if (bretur) {
        throw new Error(
          "Cannot update beli data because nomor_nota exists in bretur"
        );
      }

      // [1] Get client ID and Get tanggal_nota on beli and old nilai nota
      const client = await tx.client.findUniqueOrThrow({
        where: {
          nama_client_kota_client: {
            nama_client: validatedData.namaClient,
            kota_client: validatedData.kotaClient,
          },
        },
      });

      const oldBeli = await tx.beli.findMany({
        where: {
          nomor_nota: validatedData.nomorNota,
        },
        select: {
          tanggal_nota: true,
          qty_barang: true,
          nama_barang: true,
        },
      });

      if (oldBeli.length < 1) {
        throw new Error("Beli not found with the provided nomor_nota");
      }

      const tanggalNota = oldBeli[0].tanggal_nota;

      const oldBnota = await tx.bnota.findUniqueOrThrow({
        where: {
          nomor_nota: validatedData.nomorNota,
        },
        select: {
          nilai_nota: true,
        },
      });

      // [2] Update stock and qty_in for old beli data in parallel
      await Promise.all(
        oldBeli.map((item) =>
          tx.stock.update({
            where: {
              nama_barang: item.nama_barang,
            },
            data: {
              stock_akhir: {
                decrement: item.qty_barang,
              },
              qty_in: {
                decrement: item.qty_barang,
              },
            },
          })
        )
      );

      // [3] Delete old beli data
      await tx.beli.deleteMany({
        where: {
          nomor_nota: validatedData.nomorNota,
        },
      });

      // [4] Insert new beli data
      const mappedDataPembelian = validatedData.dataNota.map((item) => ({
        nomor_nota: validatedData.nomorNota,
        tanggal_nota: tanggalNota,
        nama_barang: item.nama_barang,
        harga_barang: item.harga_barang,
        qty_barang: item.qty_barang,
        total_harga: item.total_harga,
        diskon_nota: validatedData.diskonNota,
        id_client: client.id,
      }));

      await tx.beli.createMany({
        data: mappedDataPembelian,
      });

      await Promise.all(
        validatedData.dataNota.map((item) =>
          tx.stock.update({
            where: {
              nama_barang: item.nama_barang,
            },
            data: {
              stock_akhir: {
                increment: item.qty_barang,
              },
              qty_in: {
                increment: item.qty_barang,
              },
            },
          })
        )
      );

      // [5] Update diskon, nilaiNota, and saldoNota on bnota with new data
      await tx.bnota.update({
        where: {
          nomor_nota: validatedData.nomorNota,
        },
        data: {
          nilai_nota: validatedData.totalAkhir,
          diskon_nota: validatedData.diskonNota,
          saldo_nota: validatedData.totalAkhir,
        },
      });

      // [6] Subtract sldakhir_utang and add new totalAkhir on client
      await tx.client.update({
        where: {
          id: client.id,
        },
        data: {
          sldakhir_utang: {
            increment: validatedData.totalAkhir - oldBnota.nilai_nota,
          },
        },
      });
    });

    return NextResponse.json(
      { message: "Data successfully updated" },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in PUT /api/beli:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
