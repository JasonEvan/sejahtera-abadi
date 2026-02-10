"use client";

import NotaTable from "@/components/lihat/nota/NotaTable";
import { useDetailNotaStore } from "@/hooks/useDetailNotaStore";
import { rupiahToString } from "@/lib/rupiahToString";
import { DetailTransaksiTableRow } from "@/lib/types";
import { Box, Button } from "@mui/material";
import jsPDF from "jspdf";

function drawHeader(
  pdf: jsPDF,
  y: number = 7,
  details: DetailTransaksiTableRow[],
) {
  pdf.text("SA", 5, y);
  pdf.text(details[0].tanggal_nota, 80, y);
  pdf.text("KEPADA YTH", 105, y);
  pdf.text(details[0].nomor_nota, 80, y + 3);
  pdf.text(details[0].nama_client, 105, y + 3);
  pdf.text(details[0].kode_sales, 80, y + 6);
  const address = details[0].alamat_client
    ? `${details[0].alamat_client}${
        details[0].kota_client ? ", " + details[0].kota_client : ""
      }`
    : details[0].kota_client || "";
  pdf.text(address, 105, y + 6);

  return y + 16; // Return new y position after header
}

export default function NotaPenjualanPage() {
  const { details, total } = useDetailNotaStore();

  const handlePrint = async () => {
    if (!details || details.length === 0) return;

    const pdf = new jsPDF("p", "mm", [217, 140]);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(6.3);

    let needToChangePage = false;

    // Add header
    let y = 7;
    y = drawHeader(pdf, y, details);

    // Table headers
    const colX = [5, 10, 80, 90, 110, 125];
    const columnWidths = [5, 70, 10, 20, 15, 15];
    const headers = ["No", "Nama Barang", "Qty", "Satuan", "Harga", "Total"];
    const numericalCols = [0, 2, 4, 5];
    headers.forEach((header, i) => {
      // Align right for numerical columns
      // -1 for padding
      const x = numericalCols.includes(i)
        ? colX[i] + columnWidths[i] - pdf.getTextWidth(header) - 1
        : colX[i];
      pdf.text(header, x, y);
    });
    y += 5;

    // Table rows
    let rowCount = 0;
    details.forEach((row, index) => {
      const texts = [
        (index + 1).toString(),
        row.nama_barang,
        row.qty_barang.toString(),
        row.satuan_barang,
        row.harga_barang.toLocaleString(),
        row.total_harga.toLocaleString(),
      ];

      texts.forEach((text, i) => {
        const x = numericalCols.includes(i)
          ? colX[i] + columnWidths[i] - pdf.getTextWidth(text) - 1
          : colX[i];
        pdf.text(text, x, y);
      });

      y += 4;
      rowCount++;

      if (rowCount % 15 === 0 && index < details.length - 2) {
        if (needToChangePage) {
          pdf.addPage();
          y = 7;
          needToChangePage = false;
        } else {
          y += 28;
          needToChangePage = true;
        }

        // Redraw header
        y = drawHeader(pdf, y, details);

        // Redraw table headers
        headers.forEach((header, i) => {
          const x = numericalCols.includes(i)
            ? colX[i] + columnWidths[i] - pdf.getTextWidth(header) - 1
            : colX[i];
          pdf.text(header, x, y);
        });
        y += 5;
      }
    });

    // Total row
    pdf.text("TOTAL", colX[4], y);
    pdf.text(total, colX[5] + columnWidths[5] - pdf.getTextWidth(total) - 1, y);
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
