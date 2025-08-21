import { formatDate } from "@/lib/formatter";
import { PrismaService } from "@/lib/prisma";
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
    return NextResponse.json(
      { error: "Nomor nota is required" },
      { status: 400 }
    );
  }

  try {
    const prisma = PrismaService.getInstance();
    const results: DetailPembelianQueryResult[] = await prisma.$queryRaw`
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
        nama_barang: curr.nama_barang,
        qty_barang: curr.qty_barang,
        harga_barang: curr.harga_barang.toLocaleString("id-ID"),
        total_harga: curr.total_harga.toLocaleString("id-ID"),
      };

      acc.tableRows.push(formattedRow);

      return acc;
    }, initialState);

    return NextResponse.json({
      data: processedData.tableRows,
      totalHargaSemua: processedData.totalHargaSemua.toLocaleString("id-ID"),
    });
  } catch (error) {
    console.error("Error fetching detail pembelian:", error);
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
