import { Button, Grid, TextField } from "@mui/material";
import { useFormik } from "formik";

type FormNotaProps = {
  handleSubmit: (nomorNota: string) => Promise<void>;
  handleError: (error: string) => void;
};

export default function FormNota({ handleSubmit, handleError }: FormNotaProps) {
  const formik = useFormik({
    initialValues: {
      nomornota: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        await handleSubmit(values.nomornota);
      } catch (error) {
        handleError(
          error instanceof Error ? error.message : "An error occurred"
        );
      } finally {
        setSubmitting(false);
      }
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
      <Button type="submit" variant="contained" loading={formik.isSubmitting}>
        Search
      </Button>
    </form>
  );
}
