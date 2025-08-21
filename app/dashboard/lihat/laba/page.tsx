"use client";

import FormLaba from "@/components/lihat/laba/FormLaba";
import LabaTable from "@/components/lihat/laba/LabaTable";
import { LaporanLaba } from "@/lib/types";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import Swal from "sweetalert2";

export default function LabaPage() {
  const [data, setData] = useState<LaporanLaba | null>(null);

  const handleSubmit = async (bulan: string, tahun: string) => {
    const params = {
      bulan,
      tahun,
    };

    const queryParams = new URLSearchParams(params);

    const response = await fetch(`/api/laba?${queryParams.toString()}`, {
      cache: "no-store",
    });

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
    setData(null);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Laba Bulanan
      </Typography>
      <FormLaba handleSubmit={handleSubmit} handleError={handleError} />
      <LabaTable data={data} />
    </Box>
  );
}
