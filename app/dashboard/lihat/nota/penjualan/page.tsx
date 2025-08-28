"use client";

import FormNota from "@/components/lihat/nota/FormNota";
import NotaTable from "@/components/lihat/nota/NotaTable";
import { rupiahToString } from "@/lib/rupiahToString";
import { DetailTransaksiTableRow } from "@/lib/types";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import Swal from "sweetalert2";

export default function NotaPenjualanPage() {
  const [data, setData] = useState<DetailTransaksiTableRow[]>([]);
  const [total, setTotal] = useState<string>("0");
  const [nomorNota, setNomorNota] = useState<string>("");

  const handleSubmit = async (nomorNota: string) => {
    const params = {
      nomornota: nomorNota,
    };

    const queryParams = new URLSearchParams(params);

    const response = await fetch(
      `/api/nota/penjualan/lihat?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const { data, totalHargaSemua } = await response.json();
    setData(data);
    setTotal(totalHargaSemua);
  };

  const handleError = (error: string) => {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error,
      confirmButtonText: "OK",
    });
    setData([]);
    setTotal("0");
  };

  return (
    <Box>
      <style>{`
        @media print {
          @page {
            size: 21.7cm 12cm;
            margin: 0;
          }
        }
      `}</style>

      <Typography variant="h6" gutterBottom sx={{ displayPrint: "none" }}>
        Nota Penjualan
      </Typography>
      <FormNota
        handleSubmit={handleSubmit}
        handleError={handleError}
        setNomorNota={setNomorNota}
      />

      {nomorNota.length === 6 && data.length > 0 && (
        <Button
          variant="contained"
          color="info"
          onClick={() => window.print()}
          sx={{ marginY: 2, displayPrint: "none" }}
        >
          Print
        </Button>
      )}

      <NotaTable data={data} totalHargaSemua={total} />

      {data.length > 0 && (
        <Box sx={{ display: "none", displayPrint: "block" }}>
          <Typography
            variant="caption"
            align="left"
            sx={{
              marginLeft: 2,
              marginTop: 1,
              fontFamily: "monospace",
              fontSize: "10px",
            }}
          >
            {rupiahToString(parseInt(total.replaceAll(".", "")))} rupiah
          </Typography>
        </Box>
      )}
    </Box>
  );
}
