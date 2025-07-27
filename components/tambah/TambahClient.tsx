"use client";

import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import Swal from "sweetalert2";

export default function TambahClient() {
  const validationSchema = Yup.object({
    nama: Yup.string().required("Nama client is required"),
    kota: Yup.string().nullable(),
    alamat: Yup.string().nullable(),
    telepon: Yup.string().nullable(),
    handphone: Yup.string().nullable(),
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
      fetch("/api/client", {
        cache: "no-store",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((response) => {
          if (response.status !== 201) {
            throw new Error("Failed to add client");
          }
          return response.json();
        })
        .then((data) => {
          Swal.fire({
            title: "Success",
            text: data.message,
            icon: "success",
            confirmButtonText: "OK",
          });
          formik.resetForm();
        })
        .catch((error) => {
          Swal.fire({
            title: "Error",
            text: error.message || "An unexpected error occurred.",
            icon: "error",
            confirmButtonText: "OK",
          });
        });
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
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </form>
    </Box>
  );
}
