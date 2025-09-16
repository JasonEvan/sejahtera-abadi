import logger from "@/lib/logger";
import db from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Check if the request has a query parameter for piutang
    // This is used to filter the nota based on whether it is "piutang" or not
    // If the parameter is present, it will only return where saldo is not 0
    const notLunasOnly = request.nextUrl.searchParams.get("piutang") === "true";

    // Check if the request has a query parameter for lunas
    // This is used to filter the nota based on whether it is "lunas" or not
    // If the parameter is present, it will only return where saldo is 0
    const lunasOnly = request.nextUrl.searchParams.get("lunas") === "true";

    // Check if the request has a query parameter for notpaid
    // This is used to filter the nota based on whether it has not been paid yet
    const notPaidOnly = request.nextUrl.searchParams.get("notpaid") === "true";

    // Check if the request has a query parameter for menu
    // This is used to select only nomor and saldo nota if true
    const forMenu = request.nextUrl.searchParams.get("formenu") === "true";

    // Check if the request has a query parameter for retur
    // This is used to filter the nota based on whether it is used for retur or not
    const forRetur = request.nextUrl.searchParams.get("forretur") === "true";

    // Get nama and kota client from query parameters
    const namaClient = request.nextUrl.searchParams.get("nama") || "";
    const kotaClient = request.nextUrl.searchParams.get("kota") || "";

    // Filter saldo based on the notLunasOnly and lunasOnly parameters
    let saldoFilter: { not: number } | number | undefined = undefined;
    if (notLunasOnly) {
      saldoFilter = { not: 0 };
    } else if (lunasOnly) {
      saldoFilter = 0;
    }

    // Select fields based on whether the request is for menu or retur
    let select: Record<string, boolean> | undefined = undefined;
    if (forMenu) {
      select = {
        nomor_nota: true,
        saldo_nota: true,
      };
    } else if (forRetur) {
      select = {
        id: true,
        nama_barang: true,
        harga_barang: true,
        qty_barang: true,
        total_harga: true,
      };
    }

    // If notPaidOnly is true, filter lunas to be 0
    let pelunasanFilter: number | undefined = undefined;
    if (notPaidOnly) {
      pelunasanFilter = 0;
    }

    const nota = await db.jnota.findMany({
      where: {
        // If notLunasOnly is true, filter where saldo is not 0
        saldo_nota: saldoFilter,
        lunas_nota: pelunasanFilter,
        // If namaClient and kotaClient are provided, filter by client
        // Otherwise, do not filter by client
        client: namaClient
          ? {
              nama_client: namaClient,
              kota_client: kotaClient,
            }
          : undefined,
      },
      select,
    });

    logger.info(
      `GET /api/nota/penjualan succeeded. Found ${nota.length} items.`
    );
    return NextResponse.json(
      { data: nota },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    logger.error(
      `GET /api/nota/penjualan failed: ${
        error instanceof Error ? error.message : error
      }`
    );
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
