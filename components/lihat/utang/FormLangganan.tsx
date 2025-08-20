import { useUtangLanggananStore } from "@/hooks/lihat/useUtangLanggananStore";
import { useNamaClient } from "@/hooks/useNamaClient";
import { Autocomplete, Button, Grid, TextField } from "@mui/material";
import { useFormik } from "formik";
import Swal from "sweetalert2";

export default function FormLangganan() {
  const { namaClient, isLoading: namaClientLoading } = useNamaClient();
  const setData = useUtangLanggananStore((state) => state.setData);
  const formik = useFormik({
    initialValues: {
      namaclient: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);

        const params = {
          nama: values.namaclient.split("/")[0],
          kota: values.namaclient.split("/")[1] || "",
        };

        const queryParams = new URLSearchParams(params);

        const response = await fetch(
          `/api/beli/lihat/langganan?${queryParams.toString()}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error || "Gagal mengambil data");
        }

        const { data, summary } = await response.json();
        setData(data, summary);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error instanceof Error ? error.message : "Terjadi kesalahan",
          confirmButtonText: "OK",
        });
        setData([], {
          totalNilaiNota: "0",
          totalLunasNota: "0",
          sisaUtang: "0",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form className="w-full" onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} marginBottom={2}>
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
                  formik.touched.namaclient && Boolean(formik.errors.namaclient)
                }
                helperText={
                  formik.touched.namaclient && formik.errors.namaclient
                }
              />
            )}
          />
        </Grid>
      </Grid>
      <Button type="submit" variant="contained" loading={formik.isSubmitting}>
        Search
      </Button>
    </form>
  );
}
