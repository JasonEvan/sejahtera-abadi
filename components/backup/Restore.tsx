import { Box, Button, FormHelperText, Grid, Typography } from "@mui/material";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";

export default function Restore() {
  const validationSchema = Yup.object({
    file: Yup.mixed()
      .required("File wajib diisi")
      .test(
        "fileType",
        "Hanya file SQL yang diperbolehkan",
        (value) => value && value instanceof File && value.name.endsWith(".sql")
      ),
  });

  const formik = useFormik({
    initialValues: {
      file: null,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be revert",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, I'm sure!",
      });

      if (!result.isConfirmed) {
        return;
      }

      try {
        setSubmitting(true);
        const formData = new FormData();
        if (values.file) {
          formData.set("file", values.file as File);
        }

        const response = await fetch("/api/backup", {
          cache: "no-store",
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error || "Gagal mengembalikan data backup.");
        }

        Swal.fire({
          icon: "success",
          title: "Backup Restore Sukses",
          text: "Data backup telah berhasil dikembalikan.",
          confirmButtonText: "OK",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Restore Gagal",
          text:
            error instanceof Error
              ? error.message
              : "Terjadi kesalahan tak terduga",
          confirmButtonText: "OK",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Restore Backup Data
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2} marginBottom={2} alignItems="center">
          <Grid size={6}>
            <input
              type="file"
              id="inputfile"
              name="file"
              // handler khusus file input
              onChange={(event) => {
                formik.setFieldValue(
                  "file",
                  event.currentTarget.files?.[0] || null
                );
              }}
              onBlur={formik.handleBlur}
              className="block w-full cursor-pointer border border-gray-300 rounded-lg bg-gray-50 text-gray-900 
              focus:outline-none file:bg-gray-500 file:text-white file:py-3 file:px-3 mb-1"
            />
            {formik.touched.file && formik.errors.file ? (
              <FormHelperText error>{formik.errors.file}</FormHelperText>
            ) : (
              <Typography variant="body2">SQL File only</Typography>
            )}
          </Grid>
        </Grid>
        <Button
          type="submit"
          color="info"
          variant="contained"
          loading={formik.isSubmitting}
        >
          Restore
        </Button>
      </form>
    </Box>
  );
}
