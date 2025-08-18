import { stock } from "@/app/generated/prisma";
import { modals } from "@/lib/modal";
import { Button, DialogActions, TextField } from "@mui/material";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";

interface EditStockFormProps extends stock {
  onSaveSuccess: () => void;
}

export default function EditStockForm({
  id,
  nama_barang,
  harga_barang,
  jual_barang,
  satuan_barang,
  modal,
  rusak_barang,
  onSaveSuccess,
}: EditStockFormProps) {
  const validationSchema = Yup.object({
    namabarang: Yup.string().required("Nama Barang is required"),
    hargabarang: Yup.number()
      .required("Harga Barang is required")
      .min(0, "Harga Barang must be a positive number"),
    jualbarang: Yup.number().min(0, "Harga Jual must be a positive number"),
    satuan: Yup.string().required("Satuan Barang is required"),
    modal: Yup.number()
      .required("Modal is required")
      .min(0, "Modal must be a positive number"),
    rusakbarang: Yup.number().min(0, "Rusak Barang must be a positive number"),
  });

  const formik = useFormik({
    initialValues: {
      namabarang: nama_barang || "",
      hargabarang: harga_barang || 0,
      jualbarang: jual_barang || 0,
      satuan: satuan_barang || "",
      modal: modal || 0,
      rusakbarang: rusak_barang || 0,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        const response = await fetch(`/api/barang/${id}`, {
          cache: "no-store",
          method: "PUT",
          body: JSON.stringify({
            nama_barang: values.namabarang,
            harga_barang: values.hargabarang,
            jual_barang: values.jualbarang,
            satuan_barang: values.satuan,
            modal: values.modal,
            rusak_barang: values.rusakbarang,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update stock");
        }

        modals.close();
        onSaveSuccess();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Stock updated successfully",
          confirmButtonText: "OK",
        });
      } catch (error) {
        alert(
          error instanceof Error ? error.message : "Failed to update stock"
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
        label="Nama Barang"
        variant="standard"
        name="namabarang"
        value={formik.values.namabarang}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.namabarang && Boolean(formik.errors.namabarang)}
        helperText={formik.touched.namabarang && formik.errors.namabarang}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        fullWidth
        type="number"
        label="Harga Beli"
        variant="standard"
        name="hargabarang"
        value={formik.values.hargabarang}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.hargabarang && Boolean(formik.errors.hargabarang)}
        helperText={formik.touched.hargabarang && formik.errors.hargabarang}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        fullWidth
        type="number"
        label="Harga Jual"
        variant="standard"
        name="jualbarang"
        value={formik.values.jualbarang}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.jualbarang && Boolean(formik.errors.jualbarang)}
        helperText={formik.touched.jualbarang && formik.errors.jualbarang}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        fullWidth
        label="Satuan"
        variant="standard"
        name="satuan"
        value={formik.values.satuan}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.satuan && Boolean(formik.errors.satuan)}
        helperText={formik.touched.satuan && formik.errors.satuan}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        fullWidth
        type="number"
        label="Modal"
        variant="standard"
        name="modal"
        value={formik.values.modal}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.modal && Boolean(formik.errors.modal)}
        helperText={formik.touched.modal && formik.errors.modal}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        fullWidth
        type="number"
        label="Rusak Barnag"
        variant="standard"
        name="rusakbarang"
        value={formik.values.rusakbarang}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.rusakbarang && Boolean(formik.errors.rusakbarang)}
        helperText={formik.touched.rusakbarang && formik.errors.rusakbarang}
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
