import logger from "@/lib/logger";
import { PrismaService } from "@/lib/prisma";
import { UpdatePelunasanDTO } from "@/lib/types";
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
    const data = await prisma.jlunas.findMany({
      where: {
        nomor_nota: nomorNota,
      },
      include: {
        nota: {
          select: {
            nilai_nota: true,
          },
        },
      },
    });

    logger.info(
      `GET /api/pelunasan/piutang/${nomorNota} succeeded. Found ${data.length} items.`
    );
    return NextResponse.json({ data });
  } catch (error) {
    logger.error(
      `GET /api/pelunasan/piutang/[nomornota] failed: ${
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ nomornota: string }> }
) {
  try {
    const nomorNota = (await params).nomornota;
    const body: UpdatePelunasanDTO = await request.json();

    const schema = z.object({
      dataPelunasan: z.array(
        z.object({
          id: z.number(),
          nomor_transaksi: z.string(),
          tanggal_lunas: z.string(),
          nomor_nota: z.string(),
          lunas_nota: z.number(),
          saldo_nota: z.number(),
          id_client: z.number(),
        })
      ),
      nilai_nota: z.number(),
      lunas_nota: z.number(),
      saldo_nota: z.number(),
      lunas_lama: z.number(),
    });

    const validatedData = validate(body, schema);

    if (validatedData.dataPelunasan.length === 0) {
      throw new Error("No pelunasan data provided");
    }

    const totalLunasBaru = validatedData.dataPelunasan.reduce(
      (acc, curr) => acc + curr.lunas_nota,
      0
    );

    const prisma = PrismaService.getInstance();
    await prisma.$transaction(async (tx) => {
      // Get the current nota value in database in order to calculate the new saldo
      const nota = await tx.jnota.findUniqueOrThrow({
        where: { nomor_nota: nomorNota },
        select: { nilai_nota: true, id_client: true },
      });

      const saldoBaru = nota.nilai_nota - totalLunasBaru;

      // Delete existing pelunasan records
      await tx.jlunas.deleteMany({
        where: { nomor_nota: nomorNota },
      });

      // Insert new pelunasan records
      const mappedData = validatedData.dataPelunasan.map((item) => {
        const [day, month, year] = item.tanggal_lunas.split("/");

        return {
          nomor_transaksi: item.nomor_transaksi,
          tanggal_lunas: new Date(Number(year), Number(month) - 1, Number(day)),
          id_client: item.id_client,
          nomor_nota: nomorNota,
          lunas_nota: item.lunas_nota,
        };
      });

      await tx.jlunas.createMany({
        data: mappedData,
      });

      // Update jnota
      await tx.jnota.update({
        where: { nomor_nota: nomorNota },
        data: {
          lunas_nota: totalLunasBaru,
          saldo_nota: saldoBaru,
        },
      });

      // Update client
      await tx.client.update({
        where: {
          id: nota.id_client,
        },
        data: {
          sldakhir_piutang: {
            decrement: totalLunasBaru - validatedData.lunas_lama,
          },
        },
      });
    });

    logger.info(
      `PUT /api/pelunasan/piutang/${nomorNota} succeeded. Updated with total lunas_nota: ${totalLunasBaru}.`
    );
    return NextResponse.json({
      message: "Pelunasan data updated successfully",
    });
  } catch (error) {
    logger.error(
      `PUT /api/pelunasan/piutang/[nomornota] failed: ${
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ nomornota: string }> }
) {
  try {
    const nomorNota = (await params).nomornota;

    const prisma = PrismaService.getInstance();
    await prisma.$transaction(async (tx) => {
      // Find pelunasan records by nomor_nota
      const paymentsToDelete = await tx.jlunas.findMany({
        where: { nomor_nota: nomorNota },
        select: { lunas_nota: true },
      });

      if (paymentsToDelete.length === 0) {
        throw new Error("No pelunasan records found for this nomor_nota");
      }

      const totalDeletedAmount = paymentsToDelete.reduce(
        (acc, curr) => acc + curr.lunas_nota,
        0
      );

      // Delete pelunasan records
      await tx.jlunas.deleteMany({
        where: { nomor_nota: nomorNota },
      });

      // Update jnota
      const updatedNota = await tx.jnota.update({
        where: { nomor_nota: nomorNota },
        data: {
          lunas_nota: {
            decrement: totalDeletedAmount,
          },
          saldo_nota: {
            increment: totalDeletedAmount,
          },
        },
        select: {
          id_client: true,
        },
      });

      // Update client
      await tx.client.update({
        where: {
          id: updatedNota.id_client,
        },
        data: {
          sldakhir_piutang: {
            increment: totalDeletedAmount,
          },
        },
      });
    });

    logger.info(
      `DELETE /api/pelunasan/piutang/${nomorNota} succeeded. Payments deleted.`
    );
    return NextResponse.json({
      message: "Pelunasan data deleted successfully",
    });
  } catch (error) {
    logger.error(
      `DELETE /api/pelunasan/piutang/[nomornota] failed: ${
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
