import { useUtangLanggananStore } from "@/hooks/lihat/useUtangLanggananStore";
import { useNamaClient } from "@/hooks/useNamaClient";
import { getUtangLangganan } from "@/service/utangService";
import { Autocomplete, Button, Grid, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useEffect } from "react";
import Swal from "sweetalert2";

type FormLanggananProps = {
  setLangganan: React.Dispatch<React.SetStateAction<string>>;
};

export default function FormLangganan({ setLangganan }: FormLanggananProps) {
  const {
    data: namaClient,
    isLoading: namaClientLoading,
    isError,
    error,
  } = useNamaClient();
  const setData = useUtangLanggananStore((state) => state.setData);
  const dataTable = useUtangLanggananStore((state) => state.data);

  const utangMutation = useMutation({
    mutationFn: getUtangLangganan,
    onSuccess: (data) => {
      setData(data.data, data.summary);
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof AxiosError
          ? error.message
          : "An unexpected error occurred while fetching utang langganan data.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonText: "OK",
      });
      setData([], {
        totalNilaiNota: "0",
        totalLunasNota: "0",
        sisaUtang: "0",
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      namaclient: "",
    },
    onSubmit: async (values) => {
      utangMutation.mutate(values.namaclient);
      setLangganan(
        values.namaclient.split("/")[1]
          ? `${values.namaclient.split("/")[0]}/${
              values.namaclient.split("/")[1]
            }`
          : values.namaclient.split("/")[0],
      );
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
            : "An unexpected error occurred while fetching nama client.",
        confirmButtonText: "OK",
      });
    }
  }, [isError, error]);

  return (
    <>
      <form className="w-full" onSubmit={formik.handleSubmit}>
        <Grid
          container
          spacing={2}
          marginBottom={2}
          sx={{ displayPrint: "none" }}
        >
          <Grid size={6}>
            <Autocomplete
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
                  fullWidth
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
        </Grid>
        <Button
          type="submit"
          variant="contained"
          loading={utangMutation.isPending}
          sx={{ displayPrint: "none" }}
        >
          Search
        </Button>
      </form>
      {dataTable.length > 0 && (
        <Button
          variant="contained"
          color="info"
          onClick={() => window.print()}
          sx={{ marginY: 2, displayPrint: "none" }}
        >
          Print
        </Button>
      )}
    </>
  );
}
