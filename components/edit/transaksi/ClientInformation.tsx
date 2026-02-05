import { Autocomplete, Box, Button, Grid, TextField } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNamaClient } from "@/hooks/useNamaClient";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { AxiosError } from "axios";

export default function ClientInformation({
  clientInformationDone,
  menuNotaLoading,
  menuNota,
  fetchMenuNota,
  setClientInformation,
  setClientInformationDone,
  fetchDataNota,
  fetchMenuBarang,
}: {
  clientInformationDone: boolean;
  menuNotaLoading: boolean;
  menuNota: string[];
  fetchMenuNota: (namaClient: string, kotaClient: string) => Promise<void>;
  setClientInformation: (
    namaClient: string,
    kotaClient: string,
    nomorNota: string,
  ) => void;
  setClientInformationDone: () => void;
  fetchDataNota: () => Promise<void>;
  fetchMenuBarang: () => Promise<void>;
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
  });

  const formik = useFormik({
    initialValues: {
      namaclient: "",
      nomornota: "",
    },
    validationSchema,
    onSubmit: (values) => {
      setClientInformation(
        values.namaclient.split("/")[0],
        values.namaclient.split("/")[1] || "",
        values.nomornota,
      );
      setClientInformationDone();
      fetchDataNota();
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
            : "An unexpected error occurred while fetching client names.",
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

  return (
    <Box sx={{ marginBottom: 2 }}>
      <form className="w-full" onSubmit={formik.handleSubmit}>
        <Grid container spacing={4} marginBottom={4}>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
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
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
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
        </Grid>
        <Button
          variant="contained"
          type="submit"
          disabled={clientInformationDone}
        >
          Next
        </Button>
      </form>
    </Box>
  );
}
