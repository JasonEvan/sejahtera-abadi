import logger from "@/lib/logger";
import db from "@/lib/prisma";
import { NextResponse } from "next/server";

function calculatePercentageChange(curr: number, prev: number): number {
  if (prev === 0) {
    return curr > 0 ? 100 : 0;
  }

  return ((curr - prev) / prev) * 100;
}

export async function GET() {
  try {
    // --- 1. Tentukan rentang waktu hari ini dan kemarin ---
    const now = new Date();

    const today = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0,
        0,
        0,
        0
      )
    );

    const tomorrow = new Date(today);
    tomorrow.setUTCDate(today.getUTCDate() + 1);

    const yesterday = new Date(today);
    yesterday.setUTCDate(today.getUTCDate() - 1);

    // --- 2. Ambil data dari database ---
    const [
      todaySales,
      yesterdaySales,
      todayTransactionsCount,
      yesterdayTransactionsCount,
      todayActiveCustomersCount,
      yesterdayActiveCustomersCount,
      recentTransactionsData,
      topSellingProductsData,
    ] = await Promise.all([
      // Total sales hari ini
      db.jual.aggregate({
        _sum: { total_harga: true },
        where: { tanggal_nota: { gte: today, lt: tomorrow } },
      }),
      // Total sales kemarin
      db.jual.aggregate({
        _sum: { total_harga: true },
        where: { tanggal_nota: { gte: yesterday, lt: today } },
      }),
      // Jumlah transaksi hari ini
      db.jnota.count({
        where: { tanggal_nota: { gte: today, lt: tomorrow } },
      }),
      // Jumlah transaksi kemarin
      db.jnota.count({
        where: { tanggal_nota: { gte: yesterday, lt: today } },
      }),
      // Jumlah pelanggan aktif hari ini (unik)
      db.jnota.findMany({
        where: { tanggal_nota: { gte: today, lt: tomorrow } },
        distinct: ["id_client"],
      }),
      // Jumlah pelanggan aktif kemarin (unik)
      db.jnota.findMany({
        where: { tanggal_nota: { gte: yesterday, lt: today } },
        distinct: ["id_client"],
      }),
      // 5 transaksi terakhir
      db.jnota.findMany({
        take: 5,
        orderBy: { tanggal_nota: "desc" },
        include: {
          client: {
            select: { nama_client: true, kota_client: true },
          },
        },
      }),
      // 3 produk terlaris hari ini
      db.jual.groupBy({
        by: ["nama_barang"],
        _sum: { qty_barang: true, total_harga: true },
        where: { tanggal_nota: { gte: today, lt: tomorrow } },
        orderBy: { _sum: { total_harga: "desc" } },
        take: 3,
      }),
    ]);

    // --- 3. Format data untuk Today's Performance ---
    const currSales = todaySales._sum.total_harga || 0;
    const prevSales = yesterdaySales._sum.total_harga || 0;
    const currTransactions = todayTransactionsCount;
    const prevTransactions = yesterdayTransactionsCount;
    const currActiveCustomers = todayActiveCustomersCount.length;
    const prevActiveCustomers = yesterdayActiveCustomersCount.length;

    const salesChange = calculatePercentageChange(currSales, prevSales);
    const transactionChange = calculatePercentageChange(
      currTransactions,
      prevTransactions
    );
    const custChange = calculatePercentageChange(
      currActiveCustomers,
      prevActiveCustomers
    );
    const avgTransChange = calculatePercentageChange(
      currTransactions > 0 ? currSales / currTransactions : 0,
      prevTransactions > 0 ? prevSales / prevTransactions : 0
    );

    const todaysPerformance = [
      {
        title: "Total Sales",
        content: `Rp${currSales.toLocaleString("id-ID")}`,
        subcontent: `${salesChange >= 0 ? "+" : ""}${salesChange.toFixed(
          1
        )}% from yesterday`,
        trends:
          salesChange > 0
            ? "increase"
            : salesChange < 0
            ? "decrease"
            : "stable",
        titleIcon: "AttachMoneyIcon",
      },
      {
        title: "Transactions",
        content: currTransactions.toString(),
        subcontent: `${
          transactionChange >= 0 ? "+" : ""
        }${transactionChange.toFixed(1)}% from yesterday`,
        trends:
          transactionChange > 0
            ? "increase"
            : transactionChange < 0
            ? "decrease"
            : "stable",
        titleIcon: "ShoppingCartIcon",
      },
      {
        title: "Avg. Transaction",
        content: `Rp${(currTransactions > 0
          ? currSales / currTransactions
          : 0
        ).toLocaleString("id-ID", { maximumFractionDigits: 0 })}`,
        subcontent: `${avgTransChange >= 0 ? "+" : ""}${avgTransChange.toFixed(
          1
        )}% from yesterday`,
        trends:
          avgTransChange > 0
            ? "increase"
            : avgTransChange < 0
            ? "decrease"
            : "stable",
        titleIcon: "AttachMoneyIcon",
      },
      {
        title: "Active Customers",
        content: currActiveCustomers.toString(),
        subcontent: `${custChange >= 0 ? "+" : ""}${custChange.toFixed(
          1
        )}% from yesterday`,
        trends:
          custChange > 0 ? "increase" : custChange < 0 ? "decrease" : "stable",
        titleIcon: "PeopleIcon",
      },
    ];

    // --- 4. Format data untuk Recent Transactions ---
    const recentTransactions = recentTransactionsData.map((tx) => ({
      nota: tx.nomor_nota,
      nama: tx.client.kota_client
        ? `${tx.client.nama_client}/${tx.client.kota_client}`
        : tx.client.nama_client,
      total: tx.nilai_nota,
      status: tx.saldo_nota > 0 ? "pending" : "completed",
    }));

    // --- 5. Format data untuk Top Selling Products ---
    const topSellingProducts = topSellingProductsData.map((p) => ({
      name: p.nama_barang,
      quantity: p._sum.qty_barang || 0,
      total: p._sum.total_harga || 0,
    }));

    logger.info("GET /api/dashboard succeeded");
    return NextResponse.json({
      data: { todaysPerformance, recentTransactions, topSellingProducts },
    });
  } catch (error) {
    logger.error(
      `GET /api/dashboard failed: ${
        error instanceof Error ? error.message : error
      }`
    );
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
