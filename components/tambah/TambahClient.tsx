"use client";

import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tambahClient } from "@/service/tambah/clientService";
import { AxiosError } from "axios";

export default function TambahClient() {
  const validationSchema = Yup.object({
    nama: Yup.string().required("Nama client is required"),
    kota: Yup.string().nullable(),
    alamat: Yup.string().nullable(),
    telepon: Yup.string().nullable(),
    handphone: Yup.string().nullable(),
  });

  const queryClient = useQueryClient();
  const tambahClientMutation = useMutation({
    mutationFn: tambahClient,
    onSuccess: (data) => {
      Swal.fire({
        title: "Success",
        text: data.message,
        icon: "success",
        confirmButtonText: "OK",
      });
      queryClient.invalidateQueries({ queryKey: ["client"] });
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
      console.error("Error adding client:", error);
    },
  });

  const formik = useFormik({
    initialValues: {
      nama: "",
      kota: "",
      alamat: "",
      telepon: "",
      handphone: "",
    },
    validationSchema,
    onSubmit: (values) => {
      tambahClientMutation.mutate(values);
    },
  });

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ marginBottom: 4 }}>
        Tambah Client
      </Typography>
      <form className="w-full" onSubmit={formik.handleSubmit}>
        <Grid container spacing={4} marginBottom={4}>
          <Grid size={{ lg: 8, md: 8, sm: 12, xs: 12 }}>
            <TextField
              label="Nama Client"
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
          <Grid size={{ lg: 4, md: 4, sm: 12, xs: 12 }}>
            <TextField
              label="Kota"
              variant="outlined"
              sx={{ width: "100%" }}
              name="kota"
              value={formik.values.kota}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.kota && Boolean(formik.errors.kota)}
              helperText={formik.touched.kota && formik.errors.kota}
            />
          </Grid>
          <Grid size={{ lg: 8, md: 8, sm: 12, xs: 12 }}>
            <TextField
              label="Alamat"
              variant="outlined"
              sx={{ width: "100%" }}
              name="alamat"
              value={formik.values.alamat}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.alamat && Boolean(formik.errors.alamat)}
              helperText={formik.touched.alamat && formik.errors.alamat}
            />
          </Grid>
          <Grid size={{ lg: 4, md: 4, sm: 12, xs: 12 }}>
            <TextField
              label="No. Telepon"
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
          <Grid size={12}>
            <TextField
              label="No. Handphone"
              variant="outlined"
              sx={{ width: "100%" }}
              name="handphone"
              value={formik.values.handphone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.handphone && Boolean(formik.errors.handphone)
              }
              helperText={formik.touched.handphone && formik.errors.handphone}
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          type="submit"
          disabled={tambahClientMutation.isPending}
        >
          {tambahClientMutation.isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Box>
  );
}
