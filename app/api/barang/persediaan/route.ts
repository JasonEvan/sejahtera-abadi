import { formatDate } from "@/lib/formatter";
import { PrismaService } from "@/lib/prisma";
import { TableRow } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

interface QueryResult {
  id: number;
  nomor_nota: string;
  tanggal_nota: Date;
  nama_barang: string;
  qty_barang: number;
  harga_barang: number;
  tipe: "B" | "J";
  id_client: number;
  nama_client: string;
  kota_client: string;
  banyak_retur: number | null;
  tanggal_retur: Date | null;
}

export async function GET(request: NextRequest) {
  const namaBarang = request.nextUrl.searchParams.get("namabarang");

  if (!namaBarang) {
    return NextResponse.json(
      { message: "Nama barang is required" },
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const prisma = PrismaService.getInstance();

    const stocks = await prisma.stock.findFirstOrThrow({
      where: {
        nama_barang: namaBarang,
      },
      select: {
        stock_awal: true,
      },
    });

    const stockAwal = stocks.stock_awal;

    const result: QueryResult[] = await prisma.$queryRaw`
      SELECT * FROM (
        SELECT 
          jual.*, 
          client.nama_client, 
          client.kota_client, 
          jretur.qty_barang AS banyak_retur, 
          jretur.tanggal_retur 
        FROM jual 
        LEFT JOIN client ON jual.id_client = client.id 
        LEFT JOIN jretur ON jual.id = jretur.id_jual 
        WHERE jual.nama_barang = ${namaBarang}
        UNION ALL 
        SELECT 
          beli.*, NULL AS nama_sales,
          client.nama_client, 
          client.kota_client, 
          bretur.qty_barang AS banyak_retur, 
          bretur.tanggal_retur 
        FROM beli 
        LEFT JOIN client ON beli.id_client = client.id 
        LEFT JOIN bretur ON beli.id = bretur.id_beli 
        WHERE beli.nama_barang = ${namaBarang}
      ) AS combined 
      ORDER BY combined.tanggal_nota ASC, combined.id ASC;
    `;

    const tableRows: TableRow[] = [];
    let runningStock = stockAwal;
    let totalQtyIn = 0;
    let totalQtyOut = 0;

    for (const row of result) {
      let qtyIn = 0;
      let qtyOut = 0;
      const banyakRetur = row.banyak_retur || 0;

      if (row.tipe === "B") {
        qtyIn = row.qty_barang + banyakRetur;
        runningStock += qtyIn;
        totalQtyIn += qtyIn;
      } else {
        qtyOut = row.qty_barang + banyakRetur;
        runningStock -= qtyOut;
        totalQtyOut += qtyOut;
      }

      tableRows.push({
        nomor_nota: row.nomor_nota,
        tanggal_nota: formatDate(row.tanggal_nota),
        nama_client: row.nama_client,
        kota_client: row.kota_client || "",
        tipe: row.tipe,
        harga: row.harga_barang,
        qty_in: qtyIn > 0 ? qtyIn : null,
        qty_out: qtyOut > 0 ? qtyOut : null,
        qty_akhir: runningStock,
      });

      if (banyakRetur > 0) {
        let returQtyIn = 0;
        let returQtyOut = 0;
        let returTipe = "";

        if (row.tipe === "B") {
          returQtyOut = banyakRetur;
          runningStock -= returQtyOut;
          totalQtyOut += returQtyOut;
          returTipe = "BR";
        } else {
          returQtyIn = banyakRetur;
          runningStock += returQtyIn;
          totalQtyIn += returQtyIn;
          returTipe = "JR";
        }

        tableRows.push({
          nomor_nota: row.nomor_nota,
          tanggal_nota: row.tanggal_retur
            ? formatDate(row.tanggal_retur)
            : formatDate(row.tanggal_nota),
          nama_client: row.nama_client,
          kota_client: row.kota_client || "",
          tipe: returTipe,
          harga: row.harga_barang,
          qty_in: returQtyIn > 0 ? returQtyIn : null,
          qty_out: returQtyOut > 0 ? returQtyOut : null,
          qty_akhir: runningStock,
        });
      }
    }

    const summary = {
      totalQtyIn,
      totalQtyOut,
      stockAwal,
      finalStock: runningStock,
    };

    return NextResponse.json({ data: tableRows, summary });
  } catch (error) {
    console.error("Error fetching persediaan data:", error);
    return NextResponse.json(
      { message: "Failed to fetch persediaan data" },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
