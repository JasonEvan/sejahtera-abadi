"use client";

import {
  Box,
  Button,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tambahBarang } from "@/service/tambah/barangService";
import { AxiosError } from "axios";

export default function TambahBarang() {
  const validationSchema = Yup.object({
    nama: Yup.string().required("Nama barang is required"),
    satuan: Yup.string().required("Satuan is required"),
    stockawal: Yup.number()
      .required("Stock awal is required")
      .min(0, "Stock awal cannot be negative"),
    modal: Yup.number()
      .required("Modal is required")
      .min(0, "Modal cannot be negative"),
    hargabeli: Yup.number()
      .required("Harga beli is required")
      .min(0, "Harga beli cannot be negative"),
    hargajual: Yup.number().min(0, "Harga jual cannot be negative"),
  });

  const queryClient = useQueryClient();
  const tambahBarangMutation = useMutation({
    mutationFn: tambahBarang,
    onSuccess: (data) => {
      Swal.fire({
        title: "Success",
        text: data.message,
        icon: "success",
        confirmButtonText: "OK",
      });
      queryClient.invalidateQueries({ queryKey: ["barang"] });
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
      console.error("Error adding barang:", error);
    },
  });

  const formik = useFormik({
    initialValues: {
      nama: "",
      satuan: "",
      stockawal: 0,
      modal: 0,
      hargabeli: 0,
      hargajual: 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      // Ask for confirmation if harga jual is less than harga beli
      if (values.hargajual < values.hargabeli && values.hargajual > 0) {
        const result = await Swal.fire({
          title: "Warning",
          text: "Harga jual is less than harga beli. Are you sure you want to proceed?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });

        if (!result.isConfirmed) {
          return;
        }
      }

      tambahBarangMutation.mutate(values);
    },
  });

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ marginBottom: 4 }}>
        Tambah Barang
      </Typography>
      <form className="w-full" onSubmit={formik.handleSubmit}>
        <Grid container spacing={4} marginBottom={4}>
          <Grid size={{ lg: 10, md: 12, sm: 12, xs: 12 }}>
            <TextField
              label="Nama Barang"
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
          <Grid size={{ lg: 2, md: 12, sm: 12, xs: 12 }}>
            <TextField
              label="Satuan"
              variant="outlined"
              sx={{ width: "100%" }}
              name="satuan"
              value={formik.values.satuan}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.satuan && Boolean(formik.errors.satuan)}
              helperText={formik.touched.satuan && formik.errors.satuan}
            />
          </Grid>
          <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
            <TextField
              label="Stock Awal"
              variant="outlined"
              type="number"
              sx={{ width: "100%" }}
              name="stockawal"
              value={formik.values.stockawal}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.stockawal && Boolean(formik.errors.stockawal)
              }
              helperText={formik.touched.stockawal && formik.errors.stockawal}
            />
          </Grid>
          <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
            <TextField
              label="Modal"
              variant="outlined"
              type="number"
              sx={{ width: "100%" }}
              name="modal"
              value={formik.values.modal}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.modal && Boolean(formik.errors.modal)}
              helperText={formik.touched.modal && formik.errors.modal}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">Rp</InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{ lg: 6, md: 6, sm: 6, xs: 12 }}>
            <TextField
              label="Harga Beli"
              variant="outlined"
              type="number"
              sx={{ width: "100%" }}
              name="hargabeli"
              value={formik.values.hargabeli}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.hargabeli && Boolean(formik.errors.hargabeli)
              }
              helperText={formik.touched.hargabeli && formik.errors.hargabeli}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">Rp</InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{ lg: 6, md: 6, sm: 6, xs: 12 }}>
            <TextField
              label="Harga Jual"
              variant="outlined"
              type="number"
              sx={{ width: "100%" }}
              name="hargajual"
              value={formik.values.hargajual}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.hargajual && Boolean(formik.errors.hargajual)
              }
              helperText={formik.touched.hargajual && formik.errors.hargajual}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">Rp</InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          type="submit"
          disabled={tambahBarangMutation.isPending}
        >
          {tambahBarangMutation.isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Box>
  );
}
