"use client";

import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tambahSales } from "@/service/tambah/salesService";
import { AxiosError } from "axios";

export default function TambahSalesman() {
  const validationSchema = Yup.object({
    nama: Yup.string().required("Nama salesman is required"),
    nomordepan: Yup.number()
      .required("Nomor depan is required")
      .min(0, "Nomor depan cannot be negative"),
    telepon: Yup.string().nullable(),
    kode: Yup.string().required("Kode is required"),
  });

  const queryClient = useQueryClient();
  const tambahSalesMutation = useMutation({
    mutationFn: tambahSales,
    onSuccess: (data) => {
      Swal.fire({
        title: "Success",
        text: data.message,
        icon: "success",
        confirmButtonText: "OK",
      });
      queryClient.invalidateQueries({ queryKey: ["salesman"] });
      formik.resetForm();
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof AxiosError
          ? error.message
          : "An unexpected error occurred";
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error adding salesman:", error);
    },
  });

  const formik = useFormik({
    initialValues: {
      nama: "",
      nomordepan: 0,
      telepon: "",
      kode: "",
    },
    validationSchema,
    onSubmit: (values) => {
      tambahSalesMutation.mutate(values);
    },
  });

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ marginBottom: 4 }}>
        Tambah Salesman
      </Typography>
      <form className="w-full" onSubmit={formik.handleSubmit}>
        <Grid container spacing={4} marginBottom={4}>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
            <TextField
              label="Nama Salesman"
              variant="outlined"
              sx={{ width: "100%" }}
              name="nama"
              value={formik.values.nama}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.nama && Boolean(formik.errors.nama)}
              helperText={formik.touched.nama && formik.errors.nama}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
            <TextField
              label="Nomor Depan"
              variant="outlined"
              sx={{ width: "100%" }}
              name="nomordepan"
              type="number"
              value={formik.values.nomordepan}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.nomordepan && Boolean(formik.errors.nomordepan)
              }
              helperText={formik.touched.nomordepan && formik.errors.nomordepan}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
            <TextField
              label="No Telepon"
              variant="outlined"
              sx={{ width: "100%" }}
              name="telepon"
              value={formik.values.telepon}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.telepon && Boolean(formik.errors.telepon)}
              helperText={formik.touched.telepon && formik.errors.telepon}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
            <TextField
              label="Kode Sales"
              variant="outlined"
              sx={{ width: "100%" }}
              name="kode"
              value={formik.values.kode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.kode && Boolean(formik.errors.kode)}
              helperText={formik.touched.kode && formik.errors.kode}
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          type="submit"
          disabled={tambahSalesMutation.isPending}
        >
          {tambahSalesMutation.isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Box>
  );
}
