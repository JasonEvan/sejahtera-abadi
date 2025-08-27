import { Autocomplete, Button, Grid, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";

const month = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

type FormLabaProps = {
  handleSubmit: (bulan: string, tahun: string) => Promise<void>;
  handleError: (error: string) => void;
  setBulan: React.Dispatch<React.SetStateAction<string>>;
};

export default function FormLaba({
  handleSubmit,
  handleError,
  setBulan,
}: FormLabaProps) {
  const [menuBulan, setMenuBulan] = useState<string[]>([]);

  const formik = useFormik({
    initialValues: {
      bulan: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);

        setBulan(month[parseInt(values.bulan.split("-")[0] || "0") - 1]);

        await handleSubmit(
          values.bulan.split("-")[0] || "",
          values.bulan.split("-")[1] || ""
        );
      } catch (error) {
        handleError(
          error instanceof Error ? error.message : "An error occurred"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const currYear = new Date().getFullYear();
    const months = Array.from(
      { length: 12 },
      (_, index) => `${index + 1}-${currYear}`
    );

    setMenuBulan(months);
  }, []);

  return (
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
            value={formik.values.bulan}
            onChange={(event, newValue) => {
              formik.setFieldValue("bulan", newValue || "");
            }}
            onBlur={() => formik.setFieldTouched("bulan", true)}
            options={menuBulan}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Bulan"
                variant="outlined"
                fullWidth
                error={formik.touched.bulan && Boolean(formik.errors.bulan)}
                helperText={formik.touched.bulan && formik.errors.bulan}
              />
            )}
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        variant="contained"
        loading={formik.isSubmitting}
        sx={{ displayPrint: "none" }}
      >
        Search
      </Button>
    </form>
  );
}
