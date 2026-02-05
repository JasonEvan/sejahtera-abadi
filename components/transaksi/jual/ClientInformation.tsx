import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNamaClient } from "@/hooks/useNamaClient";
import { useNamaSales } from "@/hooks/useNamaSales";
import { useLastNomorNota } from "@/hooks/useLastNomorNota";
import { useEffect } from "react";
import { useJualStore } from "@/hooks/useJualStore";
import Swal from "sweetalert2";
import { AxiosError } from "axios";

export default function ClientInformation() {
  const {
    data: namaClient,
    isLoading: namaClientLoading,
    isError,
    error,
  } = useNamaClient();
  const { namaSales, isLoading: namaSalesLoading } = useNamaSales();
  const {
    lastNomorNota,
    isLoading: lastNomorNotaLoading,
    fetchLastNomorNota,
  } = useLastNomorNota();
  const {
    setClientInformation,
    setClientInformationDone,
    resetAll,
    fetchMenuBarang,
    clientInformationDone,
    namaLangganan,
    namaSales: namaSalesStore,
    nomorNota,
    tanggalNota,
    kotaClient,
  } = useJualStore();

  const validationSchema = Yup.object({
    namaclient: Yup.string().required("Nama client is required"),
    namasales: Yup.string().required("Nama sales is required"),
    nomornota: Yup.string().required("Nomor nota is required"),
    tanggal: Yup.date().required("Tanggal is required"),
  });

  const today: string = new Date().toISOString().split("T")[0];
  const formik = useFormik({
    initialValues: {
      namaclient:
        (kotaClient ? `${namaLangganan}/${kotaClient}` : namaLangganan) || "",
      namasales: namaSalesStore || "",
      nomornota: nomorNota || "",
      tanggal: tanggalNota || today,
    },
    validationSchema,
    onSubmit: (values) => {
      setClientInformation(
        values.namaclient.split("/")[0],
        values.namasales,
        values.nomornota,
        values.tanggal,
        values.namaclient.split("/")[1] || "",
      );
      setClientInformationDone();
      fetchMenuBarang();
    },
  });

  useEffect(() => {
    if (isError) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof AxiosError
            ? error.response?.data?.error || error.message
            : "An unexpected error occurred",
        confirmButtonText: "OK",
      });
    }
  }, [isError, error]);

  useEffect(() => {
    if (formik.values.namasales) {
      fetchLastNomorNota(formik.values.namasales);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.namasales]);

  useEffect(() => {
    formik.setFieldValue("nomornota", lastNomorNota || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastNomorNota]);

  useEffect(() => {
    if (!clientInformationDone) {
      formik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientInformationDone]);

  const reset = () => {
    formik.resetForm();
    resetAll();
  };

  return (
    <Box sx={{ marginBottom: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ marginBottom: 2 }}>
        Informasi Klien
      </Typography>
      <form className="w-full" onSubmit={formik.handleSubmit}>
        <Grid container spacing={4} marginBottom={4}>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
            <Autocomplete
              disabled={clientInformationDone}
              disablePortal
              loading={namaClientLoading}
              value={formik.values.namaclient}
              onChange={(event, newValue) => {
                formik.setFieldValue("namaclient", newValue || "");
              }}
              onBlur={() => formik.setFieldTouched("namaclient", true)}
              options={namaClient || []}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Nama Client"
                  variant="outlined"
                  sx={{ width: "100%" }}
                  error={
                    formik.touched.namaclient &&
                    Boolean(formik.errors.namaclient)
                  }
                  helperText={
                    formik.touched.namaclient && formik.errors.namaclient
                  }
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
            <Autocomplete
              disabled={clientInformationDone}
              disablePortal
              loading={namaSalesLoading}
              value={formik.values.namasales}
              onChange={(event, newValue) => {
                formik.setFieldValue("namasales", newValue || "");
              }}
              onBlur={() => formik.setFieldTouched("namasales", true)}
              options={namaSales || []}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Nama Sales"
                  variant="outlined"
                  sx={{ width: "100%" }}
                  error={
                    formik.touched.namasales && Boolean(formik.errors.namasales)
                  }
                  helperText={
                    formik.touched.namasales && formik.errors.namasales
                  }
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
            <TextField
              label="Nomor Nota"
              variant="outlined"
              sx={{ width: "100%" }}
              name="nomornota"
              value={formik.values.nomornota}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.nomornota && Boolean(formik.errors.nomornota)
              }
              helperText={formik.touched.nomornota && formik.errors.nomornota}
              disabled={lastNomorNotaLoading || clientInformationDone}
              slotProps={{
                input: {
                  endAdornment: lastNomorNotaLoading ? (
                    <InputAdornment position="end">
                      <CircularProgress />
                    </InputAdornment>
                  ) : null,
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
            <TextField
              disabled={clientInformationDone}
              label="Tanggal"
              type="date"
              variant="outlined"
              sx={{ width: "100%" }}
              name="tanggal"
              value={formik.values.tanggal}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.tanggal && Boolean(formik.errors.tanggal)}
              helperText={formik.touched.tanggal && formik.errors.tanggal}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
        <Stack direction="row" spacing={2} justifyContent="flex-start">
          <Button variant="contained" color="error" onClick={reset}>
            Reset
          </Button>
          <Button
            variant="contained"
            type="submit"
            disabled={clientInformationDone}
          >
            Next
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
