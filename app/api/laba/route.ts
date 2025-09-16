import { formatDate } from "@/lib/formatter";
import logger from "@/lib/logger";
import db from "@/lib/prisma";
import { FormattedInvoice, LabaQueryResult, LaporanLaba } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const bulan = request.nextUrl.searchParams.get("bulan");
  const tahun = request.nextUrl.searchParams.get("tahun");

  if (!bulan || !tahun) {
    logger.warn(`GET /api/laba failed: Missing 'bulan' or 'tahun' parameter.`);
    return NextResponse.json(
      { error: "Parameter 'bulan' dan 'tahun' diperlukan" },
      { status: 400 }
    );
  }

  try {
    const month = parseInt(bulan);
    const year = parseInt(tahun);

    if (isNaN(month) || isNaN(year)) {
      logger.warn(
        `GET /api/laba failed: Invalid 'bulan' or 'tahun' parameter.`
      );
      return NextResponse.json(
        { error: "Parameter 'bulan' dan 'tahun' harus berupa angka" },
        { status: 400 }
      );
    }

    const results: LabaQueryResult[] = await db.$queryRaw`
      WITH CostOfGoodsSold AS (
        -- Langkah 1: Hitung total modal (harga beli) untuk setiap nomor nota.
        -- Ini adalah bagian yang paling intensif dan kita lakukan sekali saja di sini.
        SELECT
          j.nomor_nota,
          SUM(s.harga_barang * j.qty_barang) AS total_modal_nota
        FROM
          jual j
        LEFT JOIN
          stock s ON j.nama_barang = s.nama_barang
        GROUP BY
          j.nomor_nota
      )
      -- Langkah 2: Gabungkan semuanya
      SELECT
        -- Mengambil nama_sales dari tabel 'jual' (asumsi nama sales ada di sana)
        jual_info.nama_sales,
        jn.nomor_nota,
        jn.tanggal_nota,
        c.nama_client,
        c.kota_client,
        -- Mengambil total nota langsung dari tabel 'jnota'
        jn.nilai_nota AS total_nota,
        -- Menghitung laba: nilai jual dari 'jnota' dikurangi total modal dari CTE di atas
        (jn.nilai_nota - COALESCE(cogs.total_modal_nota, 0)) AS laba_nota
      FROM
        jnota jn
      -- Gabungkan dengan hasil perhitungan modal
      LEFT JOIN
        CostOfGoodsSold cogs ON jn.nomor_nota = cogs.nomor_nota
      -- Gabungkan dengan tabel client untuk mendapatkan nama dan kota
      LEFT JOIN
        client c ON jn.id_client = c.id
      -- Gabungkan dengan tabel jual hanya untuk mendapatkan nama sales
      LEFT JOIN
        (SELECT DISTINCT nomor_nota, nama_sales FROM jual) AS jual_info ON jn.nomor_nota = jual_info.nomor_nota
      WHERE
        -- Filter berdasarkan bulan dan tahun dari tabel 'jnota'
        EXTRACT(YEAR FROM jn.tanggal_nota) = ${year} AND EXTRACT(MONTH FROM jn.tanggal_nota) = ${month}
        AND jual_info.nama_sales IS NOT NULL
      ORDER BY
        jual_info.nama_sales, jn.tanggal_nota;
    `;

    const initialState: LaporanLaba = {
      groupedBySales: {},
      grandSummary: { grandTotalNota: 0, grandTotalLaba: 0 },
    };

    const finalReport = results.reduce((acc, curr) => {
      const salesName = curr.nama_sales;
      if (!acc.groupedBySales[salesName]) {
        acc.groupedBySales[salesName] = {
          invoices: [],
          summary: { totalNota: 0, totalLaba: 0 },
        };
      }

      const formattedInvoice: FormattedInvoice = {
        ...curr,
        tanggal_nota: formatDate(new Date(curr.tanggal_nota)),
        total_nota: Number(curr.total_nota).toLocaleString("id-ID"),
        laba_nota: Number(curr.laba_nota).toLocaleString("id-ID"),
      };
      acc.groupedBySales[salesName].invoices.push(formattedInvoice);

      acc.groupedBySales[salesName].summary.totalNota += Number(
        curr.total_nota
      );
      acc.groupedBySales[salesName].summary.totalLaba += Number(curr.laba_nota);

      acc.grandSummary.grandTotalNota += Number(curr.total_nota);
      acc.grandSummary.grandTotalLaba += Number(curr.laba_nota);

      return acc;
    }, initialState);

    logger.info(`GET /api/laba succeeded. Found ${results.length} items.`);
    return NextResponse.json({ data: finalReport });
  } catch (error) {
    logger.error(
      `GET /api/laba failed: ${error instanceof Error ? error.message : error}`
    );
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
