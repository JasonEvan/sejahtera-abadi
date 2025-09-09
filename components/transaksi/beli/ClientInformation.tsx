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
import { useBeliStore } from "@/hooks/useBeliStore";
import { useEffect } from "react";

export default function ClientInformation() {
  const { namaClient, isLoading: namaClientLoading } = useNamaClient();
  const {
    setClientInformation,
    setClientInformationDone,
    fetchMenuBarang,
    resetAll,
    namaClient: namaClientStore,
    nomorNota: nomorNotaStore,
    tanggalNota: tanggalNotaStore,
    kotaClient: kotaClientStore,
    clientInformationDone,
  } = useBeliStore();

  const validationSchema = Yup.object({
    namaclient: Yup.string().required("Nama client is required"),
    nomornota: Yup.string().required("Nomor nota is required"),
    tanggal: Yup.date().required("Tanggal is required"),
  });

  const today: string = new Date().toISOString().split("T")[0];
  const formik = useFormik({
    initialValues: {
      namaclient:
        (kotaClientStore
          ? `${namaClientStore}/${kotaClientStore}`
          : namaClientStore) || "",
      nomornota: nomorNotaStore || "",
      tanggal: tanggalNotaStore || today,
    },
    validationSchema,
    onSubmit: (values) => {
      setClientInformation(
        values.namaclient.split("/")[0],
        values.nomornota,
        values.tanggal,
        values.namaclient.split("/")[1] ? values.namaclient.split("/")[1] : ""
      );
      setClientInformationDone();
      fetchMenuBarang();
    },
  });

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
            <TextField
              disabled={clientInformationDone}
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
          <Button variant="contained" type="submit">
            Next
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
