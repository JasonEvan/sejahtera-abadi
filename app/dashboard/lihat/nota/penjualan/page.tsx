"use client";

import FormNota from "@/components/lihat/nota/FormNota";
import PreviewNotaTable from "@/components/lihat/nota/PreviewNotaTable";
import { getJualByNomorNota } from "@/service/jualService";
import { Box, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Swal from "sweetalert2";

export default function PreviewNotaPenjualanPage() {
  const jualMutation = useMutation({
    mutationFn: getJualByNomorNota,
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof AxiosError
          ? error.message
          : "An unexpected error occurred while fetching the nota.";
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
      <Typography variant="h6" gutterBottom sx={{ displayPrint: "none" }}>
        Nota Penjualan
      </Typography>
      <FormNota
        handleSubmit={jualMutation.mutate}
        isLoading={jualMutation.isPending}
      />
      <PreviewNotaTable data={jualMutation.data?.data || []} type="penjualan" />
    </Box>
  );
}
