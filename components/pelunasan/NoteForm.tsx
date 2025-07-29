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
import { DataPelunasanI, MenuNota } from "@/hooks/useLunasStore";
import { useEffect, useState } from "react";

export default function NoteForm({
  menuNota,
  menuNotaLoading,
  incrementalId,
  setDataPelunasan,
  incrementId,
}: {
  menuNota: MenuNota[];
  menuNotaLoading: boolean;
  incrementalId: number;
  setDataPelunasan: (dataPelunasan: DataPelunasanI) => void;
  incrementId: () => void;
}) {
  const [notaOptions, setNotaOptions] = useState<string[]>([]);

  const validateLunasNota = (value: number, saldoNota: number) => {
    return value > 0 && value <= saldoNota;
  };

  const validationSchema = Yup.object({
    nomornota: Yup.string().required("Nomor nota is required"),
    saldonota: Yup.number(),
    lunasnota: Yup.number().required("Lunas nota is required"),
  });

  const formik = useFormik({
    initialValues: {
      nomornota: "",
      saldonota: 0,
      lunasnota: 0,
    },
    validationSchema,
    onSubmit: (values) => {
      // Validate lunas nota
      if (!validateLunasNota(values.lunasnota, values.saldonota)) {
        formik.setFieldError(
          "lunasnota",
          "Lunas nota must be greater than 0 and less than or equal to saldo nota"
        );
        return;
      }

      // Set data pelunasan
      setDataPelunasan({
        id: incrementalId,
        nomorNota: values.nomornota,
        saldoNota: values.saldonota,
        lunasNota: values.lunasnota,
      });
      incrementId();

      // Remove nomor nota from options
      setNotaOptions((prev) =>
        prev.filter((nota) => nota !== values.nomornota)
      );

      // Reset form
      formik.resetForm();
    },
  });

  useEffect(() => {
    if (menuNota && menuNota.length > 0) {
      const options = menuNota.map((nota) => nota.nomor_nota);
      setNotaOptions(options);
    }
  }, [menuNota]);

  useEffect(() => {
    const data = menuNota.find(
      (item) => item.nomor_nota === formik.values.nomornota
    );
    if (data) {
      formik.setFieldValue("saldonota", data.saldo_nota);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.nomornota]);

  return (
    <Box>
      <form className="w-full" onSubmit={formik.handleSubmit}>
        <Grid container spacing={4} marginBottom={4}>
          <Grid size={{ xs: 12, sm: 4, md: 4, lg: 4 }}>
            <Autocomplete
              disablePortal
              loading={menuNotaLoading}
              value={formik.values.nomornota}
              onChange={(event, newValue) => {
                formik.setFieldValue("nomornota", newValue || "");
              }}
              onBlur={() => formik.setFieldTouched("nomornota", true)}
              options={notaOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Nomor Nota"
                  variant="outlined"
                  sx={{ width: "100%" }}
                  error={
                    formik.touched.nomornota && Boolean(formik.errors.nomornota)
                  }
                  helperText={
                    formik.touched.nomornota && formik.errors.nomornota
                  }
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 4, lg: 4 }}>
            <TextField
              disabled
              label="Saldo Nota"
              type="number"
              variant="outlined"
              sx={{ width: "100%" }}
              name="saldonota"
              value={formik.values.saldonota}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.saldonota && Boolean(formik.errors.saldonota)
              }
              helperText={formik.touched.saldonota && formik.errors.saldonota}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">Rp</InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 4, lg: 4 }}>
            <TextField
              label="Lunas Nota"
              type="number"
              variant="outlined"
              sx={{ width: "100%" }}
              name="lunasnota"
              value={formik.values.lunasnota}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.lunasnota && Boolean(formik.errors.lunasnota)
              }
              helperText={formik.touched.lunasnota && formik.errors.lunasnota}
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
