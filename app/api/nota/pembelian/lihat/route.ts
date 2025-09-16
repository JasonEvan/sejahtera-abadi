import { formatDate } from "@/lib/formatter";
import logger from "@/lib/logger";
import db from "@/lib/prisma";
import { DetailTransaksiTableRow } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

interface DetailPembelianQueryResult {
  nomor_nota: string;
  tanggal_nota: Date;
  nama_client: string | null;
  kota_client: string | null;
  nama_barang: string;
  qty_barang: number;
  harga_barang: number;
  total_harga: number;
}

export async function GET(request: NextRequest) {
  const nomorNota = request.nextUrl.searchParams.get("nomornota");

  if (!nomorNota) {
    logger.warn(`GET /api/nota/pembelian/lihat failed: Missing nomornota`);
    return NextResponse.json(
      { error: "Nomor nota is required" },
      { status: 400 }
    );
  }

  try {
    const results: DetailPembelianQueryResult[] = await db.$queryRaw`
      SELECT 
        b.nomor_nota, b.tanggal_nota, b.nama_barang, 
        b.qty_barang, b.harga_barang, b.total_harga,
        c.nama_client, c.kota_client
      FROM 
        beli b
      LEFT JOIN 
        client c ON b.id_client = c.id
      WHERE 
        b.nomor_nota LIKE ${nomorNota + "%"}
      ORDER BY 
        b.tanggal_nota;
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
        alamat_client: "",
        nama_barang: curr.nama_barang,
        qty_barang: curr.qty_barang,
        satuan_barang: "",
        harga_barang: curr.harga_barang.toLocaleString("id-ID"),
        total_harga: curr.total_harga.toLocaleString("id-ID"),
        nama_sales: "",
        kode_sales: "",
      };

      acc.tableRows.push(formattedRow);

      return acc;
    }, initialState);

    logger.info(
      `GET /api/nota/pembelian/lihat succeeded. Found ${results.length} items for nomornota=${nomorNota}.`
    );
    return NextResponse.json({
      data: processedData.tableRows,
      totalHargaSemua: processedData.totalHargaSemua.toLocaleString("id-ID"),
    });
  } catch (error) {
    logger.error(
      `GET /api/nota/pembelian/lihat failed: ${
        error instanceof Error ? error.message : error
      }`
    );
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch detail pembelian",
      },
      { status: 500 }
    );
  }
}
