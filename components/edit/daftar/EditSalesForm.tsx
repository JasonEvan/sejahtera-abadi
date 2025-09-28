import { salesman } from "@/app/generated/prisma";
import { modals } from "@/lib/modal";
import { Button, DialogActions, TextField } from "@mui/material";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";

interface EditSalesFormProps extends salesman {
  onSaveSuccess: () => void;
}

export default function EditSalesForm({
  id,
  nama_sales,
  no_nota,
  no_telp_sales,
  kode_sales,
  onSaveSuccess,
}: EditSalesFormProps) {
  const validationSchema = Yup.object({
    namasales: Yup.string().required("Nama client is required"),
    nonota: Yup.number().required("Nomor Nota is required").min(0),
    notelpsales: Yup.string(),
    kodesales: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      namasales: nama_sales || "",
      nonota: no_nota || 0,
      notelpsales: no_telp_sales || "",
      kodesales: kode_sales || "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        const response = await fetch(`/api/sales/${id}`, {
          cache: "no-store",
          method: "PUT",
          body: JSON.stringify({
            nama_sales: values.namasales,
            no_nota: values.nonota,
            no_telp_sales: values.notelpsales,
            kode_sales: values.kodesales,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update salesman");
        }

        modals.close();
        onSaveSuccess();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Salesman updated successfully",
          confirmButtonText: "OK",
        });
      } catch (error) {
        alert(
          error instanceof Error ? error.message : "Failed to update salesman"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form className="w-full" onSubmit={formik.handleSubmit}>
      <TextField
        fullWidth
        label="Nama Sales"
        variant="standard"
        name="namasales"
        value={formik.values.namasales}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.namasales && Boolean(formik.errors.namasales)}
        helperText={formik.touched.namasales && formik.errors.namasales}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        fullWidth
        type="number"
        label="Nomor Nota"
        variant="standard"
        name="nonota"
        value={formik.values.nonota}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.nonota && Boolean(formik.errors.nonota)}
        helperText={formik.touched.nonota && formik.errors.nonota}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        fullWidth
        label="Nomer Telepon"
        variant="standard"
        name="notelpsales"
        value={formik.values.notelpsales}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.notelpsales && Boolean(formik.errors.notelpsales)}
        helperText={formik.touched.notelpsales && formik.errors.notelpsales}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        fullWidth
        label="Kode Sales"
        variant="standard"
        name="kodesales"
        value={formik.values.kodesales}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.kodesales && Boolean(formik.errors.kodesales)}
        helperText={formik.touched.kodesales && formik.errors.kodesales}
        sx={{ marginBottom: 2 }}
      />
      <DialogActions>
        <Button onClick={() => modals.close()}>Cancel</Button>
        <Button type="submit" loading={formik.isSubmitting}>
          Save
        </Button>
      </DialogActions>
    </form>
  );
}
