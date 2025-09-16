import { formatDate } from "@/lib/formatter";
import logger from "@/lib/logger";
import db from "@/lib/prisma";
import { DetailTransaksiTableRow } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

interface DetailPenjualanQueryResult {
  nomor_nota: string;
  tanggal_nota: Date;
  nama_client: string | null;
  kota_client: string | null;
  alamat_client: string | null;
  nama_barang: string;
  qty_barang: number;
  satuan_barang: string;
  harga_barang: number;
  total_harga: number;
  nama_sales: string;
  kode_sales: string;
}

export async function GET(request: NextRequest) {
  const nomorNota = request.nextUrl.searchParams.get("nomornota");

  if (!nomorNota) {
    logger.warn(`GET /api/nota/penjualan/lihat failed: Missing nomornota`);
    return NextResponse.json(
      { error: "Nomor nota is required" },
      { status: 400 }
    );
  }

  try {
    const results: DetailPenjualanQueryResult[] = await db.$queryRaw`
      SELECT 
        j.nomor_nota, 
        j.tanggal_nota, 
        j.nama_barang, 
        j.harga_barang, 
        j.qty_barang, 
        st.satuan_barang, 
        j.nama_sales, 
        j.total_harga,
        c.nama_client, 
        c.kota_client, 
        c.alamat_client, 
        s.kode_sales
      FROM 
        jual j
      JOIN
        salesman s ON j.nama_sales = s.nama_sales
      JOIN
        stock st ON j.nama_barang = st.nama_barang
      LEFT JOIN 
        client c ON j.id_client = c.id
      WHERE 
        j.nomor_nota LIKE ${nomorNota + "%"}
      ORDER BY 
        j.tanggal_nota;
    `;

    const initialState = {
      tableRows: [] as DetailTransaksiTableRow[],
      totalHargaSemua: 0,
    };

    const processedData = results.reduce((acc, curr) => {
      acc.totalHargaSemua += curr.total_harga;

      const formattedRow: DetailTransaksiTableRow = {
        nomor_nota: curr.nomor_nota,
        tanggal_nota: formatDate(curr.tanggal_nota),
        nama_client: curr.nama_client || "N/A",
        kota_client: curr.kota_client || "",
        alamat_client: curr.alamat_client || "",
        nama_barang: curr.nama_barang,
        qty_barang: curr.qty_barang,
        satuan_barang: curr.satuan_barang,
        harga_barang: curr.harga_barang.toLocaleString("id-ID"),
        total_harga: curr.total_harga.toLocaleString("id-ID"),
        nama_sales: curr.nama_sales,
        kode_sales: curr.kode_sales,
      };

      acc.tableRows.push(formattedRow);

      return acc;
    }, initialState);

    logger.info(
      `GET /api/nota/penjualan/lihat succeeded. Found ${results.length} items for nomornota=${nomorNota}.`
    );
    return NextResponse.json({
      data: processedData.tableRows,
      totalHargaSemua: processedData.totalHargaSemua.toLocaleString("id-ID"),
    });
  } catch (error) {
    logger.error(
      `GET /api/nota/penjualan/lihat failed: ${
        error instanceof Error ? error.message : error
      }`
    );
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch detail penjualan",
      },
      { status: 500 }
    );
  }
}
