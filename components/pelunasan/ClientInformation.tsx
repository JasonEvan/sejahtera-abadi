import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNamaClient } from "@/hooks/useNamaClient";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { AxiosError } from "axios";

export default function ClientInformation({
  setClientInformation,
  setClientInformationDone,
  fetchNomorNota,
  resetAll,
  clientInformationDone,
}: {
  setClientInformation: (
    namaClient: string,
    kotaClient: string,
    nomorTransaksi: string,
    tanggal: string,
  ) => void;
  setClientInformationDone: () => void;
  fetchNomorNota: () => Promise<void>;
  resetAll: () => void;
  clientInformationDone: boolean;
}) {
  const {
    data: namaClient,
    isLoading: namaClientLoading,
    isError,
    error,
  } = useNamaClient();
  const validationSchema = Yup.object({
    namaclient: Yup.string().required("Nama client is required"),
    nomortransaksi: Yup.string().required("Nomor transaksi is required"),
    tanggal: Yup.date().required("Tanggal is required"),
  });

  const today: string = new Date().toISOString().split("T")[0];
  const formik = useFormik({
    initialValues: {
      namaclient: "",
      nomortransaksi: "",
      tanggal: today,
    },
    validationSchema,
    onSubmit: (values) => {
      setClientInformation(
        values.namaclient.split("/")[0],
        values.namaclient.split("/")[1] ? values.namaclient.split("/")[1] : "",
        values.nomortransaksi,
        values.tanggal,
      );
      setClientInformationDone();
      fetchNomorNota();
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
            : "An unexpected error occurred while fetching client names.",
        confirmButtonText: "OK",
      });
    }
  }, [isError, error]);

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
          <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4 }}>
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
          <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4 }}>
            <TextField
              label="Nomor Transaksi"
              variant="outlined"
              sx={{ width: "100%" }}
              name="nomortransaksi"
              value={formik.values.nomortransaksi}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.nomortransaksi &&
                Boolean(formik.errors.nomortransaksi)
              }
              helperText={
                formik.touched.nomortransaksi && formik.errors.nomortransaksi
              }
              disabled={clientInformationDone}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4 }}>
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
