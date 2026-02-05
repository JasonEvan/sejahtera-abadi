"use client";

import FormLaba from "@/components/lihat/laba/FormLaba";
import LabaTable from "@/components/lihat/laba/LabaTable";
import { getLaba } from "@/service/labaService";
import { Box, Button, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import Swal from "sweetalert2";

export default function LabaPage() {
  const [bulan, setBulan] = useState<string>("Januari");

  const labaMutation = useMutation({
    mutationFn: getLaba,
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof AxiosError
          ? error.message
          : "An unexpected error occurred while fetching the laba data.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonText: "OK",
      });
    },
  });

  return (
    <Box>
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}</style>

      <Typography variant="h6" gutterBottom sx={{ displayPrint: "none" }}>
        Laba Bulanan
      </Typography>
      <FormLaba
        handleSubmit={(bulan, tahun) => labaMutation.mutate({ bulan, tahun })}
        setBulan={setBulan}
        isLoading={labaMutation.isPending}
      />

      {labaMutation.data?.data && (
        <Button
          variant="contained"
          color="info"
          sx={{ marginY: 2, displayPrint: "none" }}
          onClick={() => window.print()}
        >
          Print
        </Button>
      )}

      <LabaTable data={labaMutation.data?.data || null} bulan={bulan} />
    </Box>
  );
}
