"use client";

import FormNota from "@/components/lihat/nota/FormNota";
import PreviewNotaTable from "@/components/lihat/nota/PreviewNotaTable";
import { DetailTransaksiTableRow } from "@/lib/types";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import Swal from "sweetalert2";

export default function PreviewNotaPembelianPage() {
  const [data, setData] = useState<DetailTransaksiTableRow[]>([]);

  const handleSubmit = async (nomorNota: string) => {
    const params = {
      nomornota: nomorNota,
    };

    const queryParams = new URLSearchParams(params);

    const response = await fetch(
      `/api/nota/pembelian/lihat?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const { data } = await response.json();
    setData(data);
  };

  const handleError = (error: string) => {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error,
      confirmButtonText: "OK",
    });
    setData([]);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Nota Pembelian
      </Typography>
      <FormNota handleSubmit={handleSubmit} handleError={handleError} />
      <PreviewNotaTable data={data} type="pembelian" />
    </Box>
  );
}
