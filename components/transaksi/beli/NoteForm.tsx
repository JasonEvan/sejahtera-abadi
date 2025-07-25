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
import { useBeliStore } from "@/hooks/useBeliStore";
import { useEffect, useState } from "react";

export default function NoteForm() {
  const {
    menuBarang,
    isLoading: menuBarangLoading,
    setDataPembelian,
    incrementalId,
    incrementId,
    tambahTotalPembelian,
    setTotalAkhir,
  } = useBeliStore();
  const [namaBarang, setNamaBarang] = useState<string[]>([]);

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
      incrementId();
      tambahTotalPembelian(values.jumlah * values.hargabeli);
      setTotalAkhir();
      formik.resetForm();
    },
  });

  useEffect(() => {
    const namaBarangOptions = menuBarang.map((item) => item.nama_barang);
    setNamaBarang(namaBarangOptions);
  }, [menuBarang]);

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
              value={formik.values.namabarang}
              onChange={(event, newValue) => {
                formik.setFieldValue("namabarang", newValue || "");
              }}
              onBlur={() => formik.setFieldTouched("namabarang", true)}
              options={namaBarang}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Nama Barang"
                  variant="outlined"
                  sx={{ width: "100%" }}
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
              label="Harga Beli"
              type="number"
              variant="outlined"
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
          <Grid size={6}>
            <TextField
              disabled
              label="Harga Jual"
              type="number"
              variant="outlined"
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
          <Grid size={6}>
            <TextField
              label="Jumlah"
              type="number"
              variant="outlined"
              sx={{ width: "100%" }}
              name="jumlah"
              value={formik.values.jumlah}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.jumlah && Boolean(formik.errors.jumlah)}
              helperText={formik.touched.jumlah && formik.errors.jumlah}
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
