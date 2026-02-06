"use client";

import NotaTable from "@/components/lihat/nota/NotaTable";
import { useDetailNotaStore } from "@/hooks/useDetailNotaStore";
import { rupiahToString } from "@/lib/rupiahToString";
import { Box, Button } from "@mui/material";
import jsPDF from "jspdf";

export default function NotaPenjualanPage() {
  const { details, total } = useDetailNotaStore();

  const handlePrint = async () => {
    if (!details || details.length === 0) return;

    const pdf = new jsPDF("p", "mm", [140, 217]);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(6.3);

    // Add header
    pdf.text("SA", 5, 7);
    pdf.text(details[0].tanggal_nota, 80, 7);
    pdf.text("KEPADA YTH", 105, 7);
    pdf.text(details[0].nomor_nota, 80, 10);
    pdf.text(details[0].nama_client, 105, 10);
    pdf.text(details[0].kode_sales, 80, 13);
    const address = details[0].alamat_client
      ? `${details[0].alamat_client}${
          details[0].kota_client ? ", " + details[0].kota_client : ""
        }`
      : details[0].kota_client || "";
    pdf.text(address, 105, 13);

    // Table headers
    const colX = [5, 10, 80, 90, 110, 125];
    let y = 23;
    pdf.text("No", colX[0], y);
    pdf.text("Nama Barang", colX[1], y);
    pdf.text("Qty", colX[2], y);
    pdf.text("Satuan", colX[3], y);
    pdf.text("Harga", colX[4], y);
    pdf.text("Total", colX[5], y);
    y += 5;

    // Table rows
    let rowCount = 0;
    details.forEach((row, index) => {
      pdf.text((index + 1).toString(), colX[0], y);
      pdf.text(row.nama_barang, colX[1], y);
      pdf.text(row.qty_barang.toString(), colX[2], y);
      pdf.text(row.satuan_barang, colX[3], y);
      pdf.text(row.harga_barang.toLocaleString(), colX[4], y);
      pdf.text(row.total_harga.toLocaleString(), colX[5], y);
      y += 4;
      rowCount++;

      if (rowCount % 15 === 0 && index < details.length - 1) {
        pdf.addPage();
        y = 10;
        // Redraw header
        pdf.text("SA", 5, 7);
        pdf.text(details[0].tanggal_nota, 80, 7);
        pdf.text("KEPADA YTH", 105, 7);
        pdf.text(details[0].nomor_nota, 80, 10);
        pdf.text(details[0].nama_client, 105, 10);
        pdf.text(details[0].kode_sales, 80, 13);
        const address = details[0].alamat_client
          ? `${details[0].alamat_client}${
              details[0].kota_client ? ", " + details[0].kota_client : ""
            }`
          : details[0].kota_client || "";
        pdf.text(address, 105, 13);

        // Redraw table headers
        y = 23;
        pdf.text("No", colX[0], y);
        pdf.text("Nama Barang", colX[1], y);
        pdf.text("Qty", colX[2], y);
        pdf.text("Satuan", colX[3], y);
        pdf.text("Harga", colX[4], y);
        pdf.text("Total", colX[5], y);
        y += 5;
      }
    });

    // Total row
    pdf.text("TOTAL", colX[4], y);
    pdf.text(total, colX[5], y);
    y += 10;

    // Bottom text
    pdf.text(
      `${rupiahToString(parseInt(total.replace(/\./g, "")))} rupiah`,
      5,
      y,
    );

    // Generate PDF blob and open in new window for printing
    const pdfBlob = pdf.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const printWindow = window.open(pdfUrl, "_blank");

    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    } else {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "nota.pdf";
      link.click();
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        color="info"
        onClick={handlePrint}
        sx={{ marginY: 2, displayPrint: "none" }}
      >
        Print
      </Button>

      <Box>
        <NotaTable data={details} totalHargaSemua={total} />
      </Box>
    </Box>
  );
}
