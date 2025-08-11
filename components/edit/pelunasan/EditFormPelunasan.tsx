import * as Yup from "yup";
import { useFormik } from "formik";
import {
  Button,
  DialogActions,
  InputAdornment,
  TextField,
} from "@mui/material";
import { modals } from "@/lib/modal";
import { DataPelunasanI } from "@/hooks/edit/useEditLunasStore";

export default function EditFormPelunasan({
  row,
  updateDataNota,
}: {
  row: DataPelunasanI;
  updateDataNota: (data: DataPelunasanI) => void;
}) {
  const validationSchema = Yup.object({
    harga: Yup.number()
      .required("Harga barang harus diisi")
      .min(0, "Harga barang tidak boleh kurang dari 0"),
  });

  const formik = useFormik({
    initialValues: {
      harga: row.lunas_nota,
    },
    validationSchema,
    onSubmit: (values) => {
      updateDataNota({
        ...row,
        lunas_nota: values.harga,
      });

      modals.close();
    },
  });

  return (
    <form className="w-full" onSubmit={formik.handleSubmit}>
      <TextField
        fullWidth
        label="Lunas Nota"
        variant="standard"
        type="number"
        name="harga"
        value={formik.values.harga}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.harga && Boolean(formik.errors.harga)}
        helperText={formik.touched.harga && formik.errors.harga}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">Rp</InputAdornment>
            ),
          },
        }}
        sx={{ marginBottom: 2 }}
      />
      <DialogActions>
        <Button onClick={() => modals.close()}>Cancel</Button>
        <Button type="submit">Update</Button>
      </DialogActions>
    </form>
  );
}
