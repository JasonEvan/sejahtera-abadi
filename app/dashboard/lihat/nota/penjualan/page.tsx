"use client";

import FormNota from "@/components/lihat/nota/FormNota";
import NotaTable from "@/components/lihat/nota/NotaTable";
import { DetailTransaksiTableRow } from "@/lib/types";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import Swal from "sweetalert2";

export default function NotaPenjualanPage() {
  const [data, setData] = useState<DetailTransaksiTableRow[]>([]);
  const [total, setTotal] = useState<string>("0");

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
      <Typography variant="h6" gutterBottom>
        Nota Penjualan
      </Typography>
      <FormNota handleSubmit={handleSubmit} handleError={handleError} />
      <NotaTable data={data} totalHargaSemua={total} />
    </Box>
  );
}
