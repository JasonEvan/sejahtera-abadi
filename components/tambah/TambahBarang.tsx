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

export default function TambahBarang() {
  const validationSchema = Yup.object({
    nama: Yup.string().required("Nama barang is required"),
    satuan: Yup.string().required("Satuan is required"),
    stockawal: Yup.number()
      .required("Stock awal is required")
      .min(0, "Stock awal cannot be negative"),
    barangrusak: Yup.number()
      .required("Barang rusak is required")
      .min(0, "Barang rusak cannot be negative"),
    modal: Yup.number()
      .required("Modal is required")
      .min(0, "Modal cannot be negative"),
    hargabeli: Yup.number()
      .required("Harga beli is required")
      .min(0, "Harga beli cannot be negative"),
    hargajual: Yup.number().min(0, "Harga jual cannot be negative"),
  });

  const formik = useFormik({
    initialValues: {
      nama: "",
      satuan: "",
      stockawal: 0,
      barangrusak: 0,
      modal: 0,
      hargabeli: 0,
      hargajual: 0,
    },
    validationSchema,
    onSubmit: (values) => {
      // Ask for confirmation if harga jual is less than harga beli
      if (values.hargajual < values.hargabeli && values.hargajual > 0) {
        Swal.fire({
          title: "Warning",
          text: "Harga jual is less than harga beli. Are you sure you want to proceed?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        }).then((result) => {
          if (result.isConfirmed) {
            fetch("/api/tambah/barang", {
              cache: "no-store",
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(values),
            })
              .then((response) => {
                if (response.status !== 201) {
                  throw new Error("Failed to add barang");
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
                  text: error.message,
                  icon: "error",
                  confirmButtonText: "OK",
                });
                console.error("Error adding barang:", error);
              });
          }
        });
      } else {
        fetch("/api/tambah/barang", {
          cache: "no-store",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })
          .then((response) => {
            if (response.status !== 201) {
              throw new Error("Failed to add barang");
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
              text: error.message,
              icon: "error",
              confirmButtonText: "OK",
            });
            console.error("Error adding barang:", error);
          });
      }
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
          <Grid size={{ lg: 3, md: 3, sm: 12, xs: 12 }}>
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
          <Grid size={{ lg: 3, md: 3, sm: 12, xs: 12 }}>
            <TextField
              label="Barang Rusak"
              variant="outlined"
              type="number"
              sx={{ width: "100%" }}
              name="barangrusak"
              value={formik.values.barangrusak}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.barangrusak && Boolean(formik.errors.barangrusak)
              }
              helperText={
                formik.touched.barangrusak && formik.errors.barangrusak
              }
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
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </form>
    </Box>
  );
}
