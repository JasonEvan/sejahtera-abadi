import { restoreData } from "@/service/dataService";
import { Box, Button, FormHelperText, Grid, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
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
        (value) =>
          value && value instanceof File && value.name.endsWith(".sql"),
      ),
  });

  const restoreMutation = useMutation({
    mutationFn: restoreData,
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Backup Restore Sukses",
        text: "Data backup telah berhasil dikembalikan.",
        confirmButtonText: "OK",
      });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Terjadi kesalahan tak terduga saat mengembalikan data backup.";
      Swal.fire({
        icon: "error",
        title: "Restore Gagal",
        text: errorMessage,
        confirmButtonText: "OK",
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      file: null,
    },
    validationSchema,
    onSubmit: async (values) => {
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

      if (!values.file) return;

      restoreMutation.mutate(values.file as File);
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
                  event.currentTarget.files?.[0] || null,
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
          loading={restoreMutation.isPending}
        >
          Restore
        </Button>
      </form>
    </Box>
  );
}
