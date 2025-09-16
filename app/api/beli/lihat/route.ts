import { formatDate } from "@/lib/formatter";
import logger from "@/lib/logger";
import db from "@/lib/prisma";
import { UtangTableRow } from "@/lib/types";
import { NextResponse } from "next/server";

interface UtangQueryResult {
  id_client: number;
  nama_client: string;
  kota_client: string | null;
  nomor_nota: string;
  tanggal_nota: Date;
  nilai_nota: number;
  tanggal_lunas: Date | null;
  lunas_nota: number | null;
}

export async function GET() {
  try {
    const results: UtangQueryResult[] = await db.$queryRaw`
      SELECT 
        b.id_client, c.nama_client, c.kota_client,
        b.nomor_nota, b.tanggal_nota, b.nilai_nota,
        l.tanggal_lunas, l.lunas_nota
      FROM bnota b
      JOIN client c ON b.id_client = c.id
      LEFT JOIN blunas l ON b.nomor_nota = l.nomor_nota AND b.id_client = l.id_client
      ORDER BY b.tanggal_nota, l.tanggal_lunas;
    `;

    const groupedByNota = results.reduce((acc, curr) => {
      const key = curr.nomor_nota;
      if (!acc.has(key)) {
        acc.set(key, []);
      }

      acc.get(key)!.push(curr);
      return acc;
    }, new Map<string, UtangQueryResult[]>());

    const tableRows: UtangTableRow[] = [];
    let totalNilaiNota = 0;
    let totalLunasNota = 0;

    for (const rows of groupedByNota.values()) {
      const firstRow = rows[0];
      const nilaiNota = firstRow.nilai_nota;
      let saldoNota = nilaiNota;

      totalNilaiNota += nilaiNota;

      const payments = rows.filter((row) => row.lunas_nota !== null);
      if (payments.length === 0) {
        tableRows.push({
          nama_client: firstRow.nama_client,
          kota_client: firstRow.kota_client || "",
          nomor_nota: firstRow.nomor_nota,
          tanggal_nota: formatDate(firstRow.tanggal_nota),
          nilai_nota: nilaiNota.toLocaleString("id-ID"),
          lunas_nota: "0",
          tanggal_lunas: "",
          saldo_nota: saldoNota.toLocaleString("id-ID"),
        });
      } else {
        for (const payment of payments) {
          const lunasNota = payment.lunas_nota || 0;

          saldoNota -= lunasNota;
          totalLunasNota += lunasNota;

          tableRows.push({
            nama_client: payment.nama_client,
            kota_client: payment.kota_client || "",
            nomor_nota: payment.nomor_nota,
            tanggal_nota: formatDate(payment.tanggal_nota),
            nilai_nota: nilaiNota.toLocaleString("id-ID"),
            lunas_nota: lunasNota.toLocaleString("id-ID"),
            tanggal_lunas: formatDate(payment.tanggal_lunas!),
            saldo_nota: saldoNota.toLocaleString("id-ID"),
          });
        }
      }
    }

    const summary = {
      totalNilaiNota: totalNilaiNota.toLocaleString("id-ID"),
      totalLunasNota: totalLunasNota.toLocaleString("id-ID"),
      sisaUtang: (totalNilaiNota - totalLunasNota).toLocaleString("id-ID"),
    };

    logger.info(
      `GET /api/beli/lihat succeeded. Found ${tableRows.length} items.`
    );
    return NextResponse.json({ data: tableRows, summary });
  } catch (error) {
    logger.error(
      `GET /api/beli/lihat failed: ${
        error instanceof Error ? error.message : error
      }`
    );
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch utang data",
      },
      { status: 500 }
    );
  }
}
