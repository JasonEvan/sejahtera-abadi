import {
  Autocomplete,
  Box,
  Button,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useEffect } from "react";
import { MenuBarangJual, useJualStore } from "@/hooks/useJualStore";
import Swal from "sweetalert2";

export default function NoteForm() {
  const {
    menuBarang,
    isLoading: menuBarangLoading,
    incrementalId,
    setDataPenjualan,
  } = useJualStore();

  const isProfitable = (value: { modal: number; harga: number }) =>
    value.harga >= value.modal;

  const isPersediaanEnough = (value: {
    namabarang: string;
    jumlah: number;
  }) => {
    const barang = menuBarang.find(
      (item) => item.nama_barang === value.namabarang
    );

    return barang ? value.jumlah <= barang.stock_akhir : false;
  };

  const validationSchema = Yup.object({
    namabarang: Yup.string().required("Nama barang is required"),
    jumlah: Yup.number()
      .required("Jumlah is required")
      .min(1, "Jumlah must be at least 1"),
    modal: Yup.number()
      .required("Modal is required")
      .min(0, "Modal must be at least 0"),
    harga: Yup.number()
      .required("Harga is required")
      .min(0, "Harga must be at least 0"),
  });

  const formik = useFormik({
    initialValues: {
      namabarang: "",
      jumlah: 0,
      modal: 0,
      harga: 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      // validate if persediaan is enough
      if (!isPersediaanEnough(values)) {
        formik.setFieldError("jumlah", "Persediaan tidak cukup");
        return;
      }

      // validate if harga is greater than or equal to modal
      if (!isProfitable(values)) {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "Harga jual lebih kecil dari modal, apakah anda yakin?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, I'm sure!",
        });

        if (!result.isConfirmed) return;
      }

      setDataPenjualan({
        id: incrementalId,
        namaBarang: values.namabarang,
        jumlah: values.jumlah,
        hargaSatuan: values.harga,
        modal: values.modal,
        subtotal: values.jumlah * values.harga,
      });

      formik.resetForm();
    },
  });

  useEffect(() => {
    const data = menuBarang.find(
      (item) => item.nama_barang == formik.values.namabarang
    );
    if (data) {
      formik.setFieldValue("modal", data.modal);
      formik.setFieldValue("harga", data.jual_barang || 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.namabarang]);

  return (
    <Box>
      <form className="w-full" onSubmit={formik.handleSubmit}>
        <Grid container spacing={4} marginBottom={4}>
          <Grid size={{ xs: 12, sm: 12, md: 10, lg: 10 }}>
            <Autocomplete
              disablePortal
              loading={menuBarangLoading}
              options={menuBarang}
              // gunakan getOptionLabel untuk memformat tampilan opsi
              getOptionLabel={(option) =>
                `${option.nama_barang} || ${option.stock_akhir} || ${option.rusak_barang}`
              }
              value={
                menuBarang.find(
                  (item) => item.nama_barang === formik.values.namabarang
                ) || null
              }
              onChange={(event, newValue: MenuBarangJual | null) => {
                formik.setFieldValue("namabarang", newValue?.nama_barang || "");
              }}
              onBlur={() => formik.setFieldTouched("namabarang", true)}
              isOptionEqualToValue={(option, value) =>
                option.nama_barang === value.nama_barang
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Nama Barang"
                  variant="outlined"
                  fullWidth
                  error={
                    formik.touched.namabarang &&
                    Boolean(formik.errors.namabarang)
                  }
                  helperText={
                    formik.touched.namabarang && formik.errors.namabarang
                  }
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 2, lg: 2 }}>
            <TextField
              label="Jumlah"
              type="number"
              variant="outlined"
              fullWidth
              name="jumlah"
              value={formik.values.jumlah}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.jumlah && Boolean(formik.errors.jumlah)}
              helperText={formik.touched.jumlah && formik.errors.jumlah}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              disabled
              label="Modal"
              type="number"
              variant="outlined"
              fullWidth
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
          <Grid size={6}>
            <TextField
              label="Harga Jual"
              type="number"
              variant="outlined"
              fullWidth
              name="harga"
              value={formik.values.harga}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.harga && Boolean(formik.errors.harga)}
              helperText={formik.touched.harga && formik.errors.harga}
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
          Add
        </Button>
      </form>
    </Box>
  );
}
