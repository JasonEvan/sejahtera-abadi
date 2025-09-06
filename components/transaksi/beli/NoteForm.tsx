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
import { MenuBarangBeli, useBeliStore } from "@/hooks/useBeliStore";
import { useEffect } from "react";

export default function NoteForm() {
  const {
    menuBarang,
    isLoading: menuBarangLoading,
    incrementalId,
    setDataPembelian,
  } = useBeliStore();

  const validationSchema = Yup.object({
    namabarang: Yup.string().required("Nama barang is required"),
    hargabeli: Yup.number()
      .required("Harga beli is required")
      .min(0, "Harga beli must be greater than or equal to 0"),
    hargajual: Yup.number().required("Harga jual is required"),
    jumlah: Yup.number()
      .required("Jumlah is required")
      .min(1, "Jumlah must be at least 1"),
  });

  const formik = useFormik({
    initialValues: {
      namabarang: "",
      hargabeli: 0,
      hargajual: 0,
      jumlah: 0,
    },
    validationSchema,
    onSubmit: (values) => {
      setDataPembelian({
        id: incrementalId,
        namaBarang: values.namabarang,
        hargaBeli: values.hargabeli,
        hargaJual: values.hargajual,
        jumlah: values.jumlah,
        subtotal: values.jumlah * values.hargabeli,
      });
      formik.resetForm();
    },
  });

  useEffect(() => {
    const data = menuBarang.find(
      (item) => item.nama_barang === formik.values.namabarang
    );
    if (data) {
      formik.setFieldValue("hargajual", data.jual_barang || 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.namabarang]);

  return (
    <Box>
      <form className="w-full" onSubmit={formik.handleSubmit}>
        <Grid container spacing={4} marginBottom={4}>
          <Grid size={{ xs: 12, sm: 12, md: 9, lg: 9 }}>
            <Autocomplete
              disablePortal
              loading={menuBarangLoading}
              options={menuBarang}
              // gunakan getOptionLabel untuk memformat tampilan opsi
              getOptionLabel={(option) => option.nama_barang}
              value={
                menuBarang.find(
                  (item) => item.nama_barang === formik.values.namabarang
                ) || null
              }
              onChange={(event, newValue: MenuBarangBeli | null) => {
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
          <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3 }}>
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
              label="Harga Jual"
              type="number"
              variant="outlined"
              fullWidth
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
          <Grid size={6}>
            <TextField
              label="Harga Beli"
              type="number"
              variant="outlined"
              fullWidth
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
          <Button variant="contained" type="submit">
            Add
          </Button>
        </Grid>
      </form>
    </Box>
  );
}
