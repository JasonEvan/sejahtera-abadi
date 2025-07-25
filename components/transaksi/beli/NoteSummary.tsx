import { Box, Button, Grid, InputAdornment, TextField } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useBeliStore } from "@/hooks/useBeliStore";

export default function NoteSummary() {
  const {
    totalPembelian,
    totalAkhir,
    isSubmitting,
    setDiskon,
    setTotalAkhir,
    submitBeli,
    resetAll,
  } = useBeliStore();

  const validationSchema = Yup.object({
    nilainota: Yup.number()
      .required("Nilai nota is required")
      .min(0, "Nilai nota cannot be negative"),
    diskon: Yup.number()
      .required("Diskon is required")
      .min(0, "Diskon cannot be negative"),
    total: Yup.number()
      .required("Total is required")
      .min(0, "Total cannot be negative"),
  });

  const formik = useFormik({
    initialValues: {
      nilainota: 0,
      diskon: 0,
      total: 0,
    },
    validationSchema,
    onSubmit: () => {
      Swal.fire({
        title: "Are you sure?",
        text: "All data will be saved",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, I'm sure!",
      }).then((result) => {
        if (result.isConfirmed) {
          submitBeli();
          formik.resetForm();
          resetAll();
        }
      });
    },
  });

  useEffect(() => {
    formik.setFieldValue("nilainota", totalPembelian);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPembelian]);

  useEffect(() => {
    formik.setFieldValue("total", totalAkhir);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalAkhir]);

  useEffect(() => {
    if (formik.values.diskon >= 0) {
      setDiskon(formik.values.diskon);
      setTotalAkhir();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.diskon]);

  return (
    <Box>
      <form className="w-full" onSubmit={formik.handleSubmit}>
        <Grid container spacing={4} marginBottom={4}>
          <Grid size={6}>
            <TextField
              disabled
              label="Nilai Nota"
              type="number"
              variant="outlined"
              sx={{ width: "100%" }}
              name="nilainota"
              value={formik.values.nilainota}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.nilainota && Boolean(formik.errors.nilainota)
              }
              helperText={formik.touched.nilainota && formik.errors.nilainota}
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
              label="Nilai Akhir"
              type="number"
              variant="outlined"
              sx={{ width: "100%" }}
              name="total"
              value={formik.values.total}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.total && Boolean(formik.errors.total)}
              helperText={formik.touched.total && formik.errors.total}
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
              label="Diskon"
              type="number"
              variant="outlined"
              sx={{ width: "100%" }}
              name="diskon"
              value={formik.values.diskon}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.diskon && Boolean(formik.errors.diskon)}
              helperText={formik.touched.diskon && formik.errors.diskon}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={6}>
            <Button variant="contained" type="submit" loading={isSubmitting}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
