import { formatDate } from "@/lib/formatter";
import { PrismaService } from "@/lib/prisma";
import { DetailUtangTableRow } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

interface DetailUtangQueryResult {
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

    const results: DetailUtangQueryResult[] = await prisma.$queryRaw`
      SELECT 
        b.nomor_nota, 
        b.tanggal_nota, 
        b.nilai_nota,
        l.tanggal_lunas,
        l.lunas_nota
      FROM 
        bnota b
      LEFT JOIN 
        blunas l ON b.nomor_nota = l.nomor_nota AND b.id_client = l.id_client
      WHERE
        b.id_client = ${idClient}
      ORDER BY 
        b.tanggal_nota, l.tanggal_lunas;
    `;

    const groupedByNota = results.reduce(
      (acc: Record<string, DetailUtangQueryResult[]>, curr) => {
        const key = curr.nomor_nota;
        if (!acc[key]) {
          acc[key] = [];
        }

        acc[key].push(curr);
        return acc;
      },
      {}
    );

    const tableRows: DetailUtangTableRow[] = [];
    let totalNilaiNota = 0;
    let totalLunasNota = 0;

    for (const rows of Object.values(groupedByNota)) {
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
      sisaUtang: (totalNilaiNota - totalLunasNota).toLocaleString("id-ID"),
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
