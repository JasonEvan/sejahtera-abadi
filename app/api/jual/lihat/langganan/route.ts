import { formatDate } from "@/lib/formatter";
import { PrismaService } from "@/lib/prisma";
import { DetailUtangTableRow } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

interface DetailPiutangQueryResult {
  nomor_nota: string;
  tanggal_nota: Date;
  nilai_nota: number;
  tanggal_lunas: Date | null;
  lunas_nota: number | null;
}

export async function GET(request: NextRequest) {
  const nama = request.nextUrl.searchParams.get("nama") || "";
  const kota = request.nextUrl.searchParams.get("kota") || "";

  if (!nama) {
    return NextResponse.json(
      { error: "Nama client tidak boleh kosong" },
      { status: 400 }
    );
  }

  try {
    const prisma = PrismaService.getInstance();
    const client = await prisma.client.findUnique({
      where: {
        nama_client_kota_client: {
          nama_client: nama,
          kota_client: kota,
        },
      },
      select: {
        id: true,
      },
    });

    if (!client) {
      return NextResponse.json(
        { error: "Client tidak ditemukan" },
        { status: 404 }
      );
    }

    const idClient = client.id;

    const results: DetailPiutangQueryResult[] = await prisma.$queryRaw`
      SELECT 
        j.nomor_nota, 
        j.tanggal_nota, 
        j.nilai_nota,
        l.tanggal_lunas,
        l.lunas_nota
      FROM 
        jnota j
      LEFT JOIN 
        jlunas l ON j.nomor_nota = l.nomor_nota AND j.id_client = l.id_client
      WHERE
        j.id_client = ${idClient}
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
    }, new Map<string, DetailPiutangQueryResult[]>());

    const tableRows: DetailUtangTableRow[] = [];
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
    console.error("Error fetching langganan:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengambil data langganan",
      },
      { status: 500 }
    );
  }
}
