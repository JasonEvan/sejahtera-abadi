import logger from "@/lib/logger";
import { PrismaService } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  let sqlDump = "";

  // Helper function for making Insert SQL statements
  function makeInsert(
    table: string,
    rows: Record<string, string | number | boolean | Date | null>[]
  ): string {
    if (rows.length === 0) return "";

    const keys = Object.keys(rows[0]);
    const cols = keys.join(", ");

    const values = rows
      .map((row) => {
        const vals = keys.map((key) => {
          const value = row[key];
          if (value === null) return "NULL";
          if (typeof value === "string")
            return `'${value.replace(/'/g, "''")}'`;
          if (value instanceof Date) return `'${value.toISOString()}'`;
          return value;
        });
        return `(${vals.join(", ")})`;
      })
      .join(",\n");

    return `INSERT INTO ${table} (${cols}) VALUES\n${values};\n\n`;
  }

  // Helper function for making Setval SQL statements
  function makeSetval(table: string, idColumn: string = "id"): string {
    return `SELECT setval(pg_get_serial_sequence('"${table}"', '${idColumn}'), COALESCE((SELECT MAX(${idColumn}) FROM "${table}"), 0) + 1, false);\n`;
  }

  try {
    const prisma = PrismaService.getInstance();

    // Get client
    const clients = await prisma.client.findMany();
    sqlDump += makeInsert("client", clients);

    // Get salesman
    const salesmen = await prisma.salesman.findMany();
    sqlDump += makeInsert("salesman", salesmen);

    // Get stock
    const stocks = await prisma.stock.findMany();
    sqlDump += makeInsert("stock", stocks);

    // Get bnota
    const bnotas = await prisma.bnota.findMany();
    sqlDump += makeInsert("bnota", bnotas);

    // Get jnota
    const jnotas = await prisma.jnota.findMany();
    sqlDump += makeInsert("jnota", jnotas);

    // Get beli
    const beli = await prisma.beli.findMany();
    sqlDump += makeInsert("beli", beli);

    // Get jual
    const jual = await prisma.jual.findMany();
    sqlDump += makeInsert("jual", jual);

    // Get blunas
    const blunas = await prisma.blunas.findMany();
    sqlDump += makeInsert("blunas", blunas);

    // Get jlunas
    const jlunas = await prisma.jlunas.findMany();
    sqlDump += makeInsert("jlunas", jlunas);

    // Get bretur
    const bretur = await prisma.bretur.findMany();
    sqlDump += makeInsert("bretur", bretur);

    // Get jretur
    const jretur = await prisma.jretur.findMany();
    sqlDump += makeInsert("jretur", jretur);

    // Tambahkan setval untuk semua tabel yang punya auto increment
    sqlDump += "\n-- Reset sequences\n";
    sqlDump += makeSetval("client");
    sqlDump += makeSetval("salesman");
    sqlDump += makeSetval("stock");
    sqlDump += makeSetval("bnota");
    sqlDump += makeSetval("jnota");
    sqlDump += makeSetval("beli");
    sqlDump += makeSetval("jual");
    sqlDump += makeSetval("blunas");
    sqlDump += makeSetval("jlunas");
    sqlDump += makeSetval("bretur");
    sqlDump += makeSetval("jretur");

    logger.info("GET /api/download succeeded.");
    return new NextResponse(sqlDump, {
      headers: {
        "Content-Type": "application/sql",
        "Content-Disposition": "attachment; filename=backup.sql",
      },
    });
  } catch (error) {
    logger.error(
      `GET /api/download failed: ${
        error instanceof Error ? error.message : error
      }`
    );
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
