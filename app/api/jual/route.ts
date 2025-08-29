import logger from "@/lib/logger";
import { PrismaService } from "@/lib/prisma";
import { EditDTO, JualDTO } from "@/lib/types";
import { validate } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(request: NextRequest) {
  const nota = request.nextUrl.searchParams.get("nota") || undefined;

  try {
    const prisma = PrismaService.getInstance();
    const data = await prisma.jual.findMany({
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

    logger.info(`GET /api/jual succeeded. Found ${data.length} items.`);
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    logger.error(
      `GET /api/jual failed: ${error instanceof Error ? error.message : error}`
    );
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}

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

    logger.info(`POST /api/jual succeeded. Jual processed.`);
    return NextResponse.json(
      { message: "Data successfully saved" },
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    logger.error(
      `POST /api/jual failed: ${error instanceof Error ? error.message : error}`
    );
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
      // [0] validate if nomorNota exists in jretur
      const jretur = await tx.jretur.findFirst({
        where: {
          nomor_nota: validatedData.nomorNota,
        },
      });

      if (jretur) {
        throw new Error(
          "Cannot update jual data because nomor_nota exists in jretur"
        );
      }

      // [1] Get client ID and Get tanggal_nota and salesman on jual and old nilai nota
      const client = await tx.client.findUniqueOrThrow({
        where: {
          nama_client_kota_client: {
            nama_client: validatedData.namaClient,
            kota_client: validatedData.kotaClient,
          },
        },
      });

      const oldJual = await tx.jual.findMany({
        where: {
          nomor_nota: validatedData.nomorNota,
        },
        select: {
          tanggal_nota: true,
          nama_sales: true,
          qty_barang: true,
          nama_barang: true,
        },
      });

      if (oldJual.length < 1) {
        throw new Error("Jual not found with the provided nomor_nota");
      }

      const tanggalNota = oldJual[0].tanggal_nota;
      const namaSales = oldJual[0].nama_sales;

      const oldJnota = await tx.jnota.findUniqueOrThrow({
        where: {
          nomor_nota: validatedData.nomorNota,
        },
        select: {
          nilai_nota: true,
        },
      });

      // [2] Update stock and qty_out for old jual data in parallel
      await Promise.all(
        oldJual.map((item) =>
          tx.stock.update({
            where: {
              nama_barang: item.nama_barang,
            },
            data: {
              stock_akhir: {
                increment: item.qty_barang,
              },
              qty_out: {
                decrement: item.qty_barang,
              },
            },
          })
        )
      );

      // [3] Delete old jual data
      await tx.jual.deleteMany({
        where: {
          nomor_nota: validatedData.nomorNota,
        },
      });

      // [4] Insert new jual data
      const mappedDataPenjualan = validatedData.dataNota.map((item) => ({
        nomor_nota: validatedData.nomorNota,
        tanggal_nota: tanggalNota,
        nama_barang: item.nama_barang,
        harga_barang: item.harga_barang,
        qty_barang: item.qty_barang,
        total_harga: item.total_harga,
        diskon_nota: validatedData.diskonNota,
        id_client: client.id,
        nama_sales: namaSales,
      }));

      await tx.jual.createMany({
        data: mappedDataPenjualan,
      });

      await Promise.all(
        validatedData.dataNota.map((item) =>
          tx.stock.update({
            where: {
              nama_barang: item.nama_barang,
            },
            data: {
              stock_akhir: {
                decrement: item.qty_barang,
              },
              qty_out: {
                increment: item.qty_barang,
              },
            },
          })
        )
      );

      // [5] Update diskon, nilaiNota, and saldoNota on jnota with new data
      await tx.jnota.update({
        where: {
          nomor_nota: validatedData.nomorNota,
        },
        data: {
          nilai_nota: validatedData.totalAkhir,
          diskon_nota: validatedData.diskonNota,
          saldo_nota: validatedData.totalAkhir,
        },
      });

      // [6] Subtract sldakhir_piutang and add new totalAkhir on client
      await tx.client.update({
        where: {
          id: client.id,
        },
        data: {
          sldakhir_piutang: {
            increment: validatedData.totalAkhir - oldJnota.nilai_nota,
          },
        },
      });
    });

    logger.info(`PUT /api/jual succeeded. Jual updated.`);
    return NextResponse.json(
      { message: "Data successfully updated" },
      { status: 200 }
    );
  } catch (error) {
    logger.error(
      `PUT /api/jual failed: ${error instanceof Error ? error.message : error}`
    );
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}
