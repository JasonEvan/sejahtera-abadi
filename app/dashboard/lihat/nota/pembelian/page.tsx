"use client";

import FormNota from "@/components/lihat/nota/FormNota";
import PreviewNotaTable from "@/components/lihat/nota/PreviewNotaTable";
import { getBeliByNomorNota } from "@/service/beliService";
import { Box, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Swal from "sweetalert2";

export default function PreviewNotaPembelianPage() {
  const beliMutation = useMutation({
    mutationFn: getBeliByNomorNota,
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
      <Typography variant="h6" gutterBottom>
        Nota Pembelian
      </Typography>
      <FormNota
        handleSubmit={beliMutation.mutate}
        isLoading={beliMutation.isPending}
      />
      <PreviewNotaTable data={beliMutation.data?.data || []} type="pembelian" />
    </Box>
  );
}
