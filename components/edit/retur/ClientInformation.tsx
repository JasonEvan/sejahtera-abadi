import { Autocomplete, Box, Button, Grid, TextField } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useEffect } from "react";

type ClientInformationProps = {
  nomorNotaOption: string[];
  nomorNotaLoading: boolean;
  nomorNotaDone: boolean;
  setNomorNota: (nomorNota: string) => void;
  setNomorNotaDone: () => void;
  fetchDataRetur: (nomorNota: string) => Promise<void>;
};

export default function ClientInformation({
  nomorNotaOption,
  nomorNotaLoading,
  nomorNotaDone,
  setNomorNota,
  setNomorNotaDone,
  fetchDataRetur,
}: ClientInformationProps) {
  const validationSchema = Yup.object({
    nomornota: Yup.string()
      .required("Nomor nota is required")
      .oneOf(nomorNotaOption, "Invalid nomor nota"),
  });

  const formik = useFormik({
    initialValues: {
      nomornota: "",
    },
    validationSchema,
    onSubmit: (values) => {
      setNomorNota(values.nomornota);
      setNomorNotaDone();
      fetchDataRetur(values.nomornota);
    },
  });

  useEffect(() => {
    if (!nomorNotaDone) {
      formik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nomorNotaDone]);

  return (
    <Box>
      <form className="w-full" onSubmit={formik.handleSubmit}>
        <Grid container spacing={4} marginBottom={2}>
          <Grid size={6}>
            <Autocomplete
              disabled={nomorNotaDone}
              disablePortal
              loading={nomorNotaLoading}
              value={formik.values.nomornota}
              onChange={(event, newValue) => {
                formik.setFieldValue("nomornota", newValue || "");
              }}
              onBlur={() => formik.setFieldTouched("nomornota", true)}
              options={nomorNotaOption || []}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Nomor Nota"
                  variant="outlined"
                  fullWidth
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
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </form>
    </Box>
  );
}
