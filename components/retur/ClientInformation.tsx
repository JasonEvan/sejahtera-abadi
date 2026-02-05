import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNamaClient } from "@/hooks/useNamaClient";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { AxiosError } from "axios";

export default function ClientInformation({
  clientInformationDone,
  isLoading: menuNotaLoading,
  menuNota,
  setClientInformation,
  setClientInformationDone,
  fetchDataNota,
  fetchMenuNota,
  resetAll,
}: {
  clientInformationDone: boolean;
  isLoading: boolean;
  menuNota: string[];
  setClientInformation: (
    namaClient: string,
    kotaClient: string,
    nomorNota: string,
    tanggal: string,
  ) => void;
  setClientInformationDone: () => void;
  fetchDataNota: () => Promise<void>;
  fetchMenuNota: (namaClient: string, kotaClient: string) => void;
  resetAll: () => void;
}) {
  const {
    data: namaClient,
    isLoading: namaClientLoading,
    isError,
    error,
  } = useNamaClient();

  const validationSchema = Yup.object({
    namaclient: Yup.string().required("Nama client is required"),
    nomornota: Yup.string().required("Nomor nota is required"),
    tanggal: Yup.date().required("Tanggal retur is required"),
  });

  const today: string = new Date().toISOString().split("T")[0];
  const formik = useFormik({
    initialValues: {
      namaclient: "",
      nomornota: "",
      tanggal: today,
    },
    validationSchema,
    onSubmit: (values) => {
      setClientInformation(
        values.namaclient.split("/")[0],
        values.namaclient.split("/")[1] || "",
        values.nomornota,
        values.tanggal,
      );
      setClientInformationDone();
      fetchDataNota();
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
    if (formik.values.namaclient && formik.values.namaclient.length > 0) {
      fetchMenuNota(
        formik.values.namaclient.split("/")[0],
        formik.values.namaclient.split("/")[1] || "",
      );
      formik.setFieldValue("nomornota", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.namaclient]);

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
            <Autocomplete
              disabled={clientInformationDone}
              disablePortal
              loading={menuNotaLoading}
              value={formik.values.nomornota}
              onChange={(event, newValue) => {
                formik.setFieldValue("nomornota", newValue || "");
              }}
              onBlur={() => formik.setFieldTouched("nomornota", true)}
              options={menuNota || []}
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
