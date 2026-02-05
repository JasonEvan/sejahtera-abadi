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
  handleSubmit: (bulan: string, tahun: string) => void;
  setBulan: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
};

export default function FormLaba({
  handleSubmit,
  setBulan,
  isLoading,
}: FormLabaProps) {
  const [menuBulan, setMenuBulan] = useState<string[]>([]);

  const formik = useFormik({
    initialValues: {
      bulan: "",
    },
    onSubmit: (values) => {
      setBulan(month[parseInt(values.bulan.split("-")[0] || "0") - 1]);

      handleSubmit(
        values.bulan.split("-")[0] || "",
        values.bulan.split("-")[1] || "",
      );
    },
  });

  useEffect(() => {
    const currYear = new Date().getFullYear();
    const months = Array.from(
      { length: 12 },
      (_, index) => `${index + 1}-${currYear}`,
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
        loading={isLoading}
        sx={{ displayPrint: "none" }}
      >
        Search
      </Button>
    </form>
  );
}
