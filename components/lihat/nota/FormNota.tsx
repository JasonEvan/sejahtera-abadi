import { Button, Grid, TextField } from "@mui/material";
import { useFormik } from "formik";

type FormNotaProps = {
  handleSubmit: (nomorNota: string) => void;
  isLoading: boolean;
};

export default function FormNota({ handleSubmit, isLoading }: FormNotaProps) {
  const formik = useFormik({
    initialValues: {
      nomornota: "",
    },
    onSubmit: (values) => {
      handleSubmit(values.nomornota);
    },
  });

  return (
    <form className="w-full" onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} marginBottom={2}>
        <Grid size={6}>
          <TextField
            label="Nomor Nota"
            variant="outlined"
            fullWidth
            name="nomornota"
            value={formik.values.nomornota}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.nomornota && Boolean(formik.errors.nomornota)}
            helperText={formik.touched.nomornota && formik.errors.nomornota}
          />
        </Grid>
      </Grid>
      <Button type="submit" variant="contained" loading={isLoading}>
        Search
      </Button>
    </form>
  );
}
