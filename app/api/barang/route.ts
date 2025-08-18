import { PrismaService } from "@/lib/prisma";
import { TambahBarangFormValues } from "@/lib/types";
import { validate } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET() {
  try {
    const prisma = PrismaService.getInstance();
    const stocks = await prisma.stock.findMany({
      orderBy: {
        nama_barang: "asc",
      },
    });

    return NextResponse.json({ data: stocks });
  } catch (error) {
    console.error("Error fetching stocks:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch stocks",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body: TambahBarangFormValues = await request.json();
    console.log("Received data:", body);

    // Validate the incoming data using Zod
    const zodSchema = z.object({
      nama: z.string().min(1, "Nama barang is required"),
      satuan: z.string().min(1, "Satuan is required"),
      stockawal: z.number().min(0, "Stock awal cannot be negative"),
      barangrusak: z.number().min(0, "Barang rusak cannot be negative"),
      modal: z.number().min(0, "Modal cannot be negative"),
      hargabeli: z.number().min(0, "Harga beli cannot be negative"),
      hargajual: z.number().min(0, "Harga jual cannot be negative").nullable(),
    });
    const validatedData = validate(body, zodSchema);

    // Create a new PrismaService instance
    const prisma = PrismaService.getInstance();
    const result = await prisma.stock.create({
      data: {
        nama_barang: validatedData.nama,
        satuan_barang: validatedData.satuan,
        stock_awal: validatedData.stockawal,
        stock_akhir: validatedData.stockawal,
        rusak_barang: validatedData.barangrusak,
        modal: validatedData.modal,
        harga_barang: validatedData.hargabeli,
        jual_barang: validatedData.hargajual ? validatedData.hargajual : null, // Handle optional field
      },
    });

    return NextResponse.json(
      { message: "Barang added successfully", data: result },
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      {
        message: "Failed to add barang",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
