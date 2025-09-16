import logger from "@/lib/logger";
import db from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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
    // Get client
    const clients = await db.client.findMany();
    sqlDump += makeInsert("client", clients);

    // Get salesman
    const salesmen = await db.salesman.findMany();
    sqlDump += makeInsert("salesman", salesmen);

    // Get stock
    const stocks = await db.stock.findMany();
    sqlDump += makeInsert("stock", stocks);

    // Get bnota
    const bnotas = await db.bnota.findMany();
    sqlDump += makeInsert("bnota", bnotas);

    // Get jnota
    const jnotas = await db.jnota.findMany();
    sqlDump += makeInsert("jnota", jnotas);

    // Get beli
    const beli = await db.beli.findMany();
    sqlDump += makeInsert("beli", beli);

    // Get jual
    const jual = await db.jual.findMany();
    sqlDump += makeInsert("jual", jual);

    // Get blunas
    const blunas = await db.blunas.findMany();
    sqlDump += makeInsert("blunas", blunas);

    // Get jlunas
    const jlunas = await db.jlunas.findMany();
    sqlDump += makeInsert("jlunas", jlunas);

    // Get bretur
    const bretur = await db.bretur.findMany();
    sqlDump += makeInsert("bretur", bretur);

    // Get jretur
    const jretur = await db.jretur.findMany();
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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file: File | null = formData.get("file") as File;

    if (!file) {
      logger.warn("POST /api/backup failed: No file uploaded.");
      return NextResponse.json({ error: "File wajib diisi." }, { status: 400 });
    }

    if (!file.name.endsWith(".sql")) {
      logger.warn("POST /api/backup failed: Invalid file type.");
      return NextResponse.json(
        { error: "Hanya file SQL yang diperbolehkan." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const sqlContent = buffer.toString("utf-8");
    const queries = sqlContent
      .split(/;\s*\n/)
      .map((query) => query.trim())
      .filter((query) => query.length > 0);

    await db.$transaction(async (tx) => {
      // Clear existing data
      await tx.$executeRaw`TRUNCATE TABLE client, salesman, stock, bnota, jnota, beli, jual, blunas, jlunas, bretur, jretur RESTART IDENTITY CASCADE;`;

      // Execute query
      for (const query of queries) {
        await tx.$executeRawUnsafe(query);
      }
    });

    logger.info(
      `POST /api/backup succeeded. Executed ${queries.length} queries.`
    );
    return NextResponse.json({ message: "Restore berhasil." });
  } catch (error) {
    logger.error(
      `POST /api/backup failed: ${
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

export async function DELETE() {
  try {
    await db.$executeRaw`TRUNCATE TABLE client, salesman, stock, bnota, jnota, beli, jual, blunas, jlunas, bretur, jretur RESTART IDENTITY CASCADE;`;

    logger.info("DELETE /api/backup succeeded. All data deleted.");
    return NextResponse.json({ message: "All data deleted successfully." });
  } catch (error) {
    logger.error(
      `DELETE /api/backup failed: ${
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
