import { formatDate } from "@/lib/formatter";
import { PrismaService } from "@/lib/prisma";
import { UtangTableRow } from "@/lib/types";
import { NextResponse } from "next/server";

interface PiutangQueryResult {
  id_client: number;
  nama_client: string;
  kota_client: string;
  nomor_nota: string;
  tanggal_nota: Date;
  nilai_nota: number;
  tanggal_lunas: Date | null;
  lunas_nota: number | null;
}

export async function GET() {
  try {
    const prisma = PrismaService.getInstance();
    const results: PiutangQueryResult[] = await prisma.$queryRaw`
      SELECT 
        j.id_client,
        c.nama_client, 
        c.kota_client,
        j.nomor_nota, 
        j.tanggal_nota, 
        j.nilai_nota,
        l.tanggal_lunas,
        l.lunas_nota
      FROM 
        jnota j
      JOIN 
        client c ON j.id_client = c.id
      LEFT JOIN 
        jlunas l ON j.nomor_nota = l.nomor_nota AND j.id_client = l.id_client
      ORDER BY 
        j.tanggal_nota, l.tanggal_lunas;
    `;

    const groupedByNota = results.reduce((acc, curr) => {
      const key = curr.nomor_nota;
      if (!acc.has(key)) {
        acc.set(key, []);
      }

      acc.get(key)!.push(curr);
      return acc;
    }, new Map<string, PiutangQueryResult[]>());

    /**
     * Use UtangTableRow because the structure is similar
     * to the one used in the 'beli' endpoint.
     */
    const tableRows: UtangTableRow[] = [];
    let totalNilaiNota = 0;
    let totalLunasNota = 0;

    for (const rows of groupedByNota.values()) {
      const firstRow = rows[0];
      const nilaiNota = firstRow.nilai_nota;
      let saldoNota = nilaiNota;

      totalNilaiNota += nilaiNota;

      const payments = rows.filter((r) => r.lunas_nota !== null);

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
      sisaPiutang: (totalNilaiNota - totalLunasNota).toLocaleString("id-ID"),
    };

    return NextResponse.json({ data: tableRows, summary });
  } catch (error) {
    console.error("Error fetching piutang data:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch piutang data",
      },
      { status: 500 }
    );
  }
}
