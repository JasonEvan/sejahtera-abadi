import { Box, Button, Grid, InputAdornment, TextField } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function NoteSummary({
  diskon,
  totalAkhir,
  nilaiNota,
  isLoading,
  setDiskonNota,
  submitEdit,
}: {
  diskon: number;
  totalAkhir: number;
  nilaiNota: number;
  isLoading: boolean;
  setDiskonNota: (diskon: number) => void;
  submitEdit: () => Promise<boolean>;
}) {
  const validationSchema = Yup.object({
    diskonnota: Yup.number()
      .min(0, "Diskon tidak boleh kurang dari 0")
      .max(100, "Diskon tidak boleh lebih dari 100"),
  });

  const formik = useFormik({
    initialValues: {
      diskonnota: diskon || 0,
    },
    validationSchema,
    onSubmit: async () => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, I'm sure!",
      });

      if (result.isConfirmed) {
        const success = await submitEdit();
        if (success) formik.resetForm();
      }
    },
  });

  /**
   * Nilai diskon pada saat awal akan difetch terlebih dahulu
   * dan akan di-set ke formik untuk ditampilkan pada input diskon
   * saat diskon sudah berubah.
   */
  useEffect(() => {
    if (diskon) {
      formik.setFieldValue("diskonnota", diskon);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diskon]);

  useEffect(() => {
    if (formik.values.diskonnota >= 0) {
      setDiskonNota(formik.values.diskonnota);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.diskonnota]);

  return (
    <Box>
      <form className="w-full" onSubmit={formik.handleSubmit}>
        <Grid container spacing={4} marginBottom={4}>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
            <TextField
              type="number"
              label="Diskon"
              variant="outlined"
              name="diskonnota"
              value={formik.values.diskonnota}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.diskonnota && Boolean(formik.errors.diskonnota)
              }
              helperText={formik.touched.diskonnota && formik.errors.diskonnota}
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
            <TextField
              disabled
              type="number"
              label="Total Akhir"
              variant="outlined"
              value={totalAkhir}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">Rp</InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
            <TextField
              disabled
              type="number"
              label="Nilai Nota"
              variant="outlined"
              value={nilaiNota}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">Rp</InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
            <Button variant="contained" loading={isLoading} type="submit">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
