import { useModalStore } from "@/hooks/useModalStore";
import { NotaI } from "@/hooks/useReturStore";
import { Button, DialogActions, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function ReturForm({
  row,
  returBarang,
}: {
  row: NotaI;
  returBarang: (
    row: NotaI,
    jumlahReturBaru: number,
    jumlahReturSebelum: number
  ) => void;
}) {
  const close = useModalStore((state) => state.close);
  const validationSchema = Yup.object({
    jumlah: Yup.number()
      .required("Jumlah retur harus diisi")
      .min(0, "Jumlah retur tidak boleh kurang dari 0")
      .max(
        row.qty_barang + row.retur_barang,
        "Jumlah retur tidak boleh melebihi jumlah barang yang ada"
      ),
  });

  const formik = useFormik({
    initialValues: {
      jumlah: row.retur_barang || 0,
    },
    validationSchema,
    onSubmit: (values) => {
      returBarang(row, values.jumlah, row.retur_barang || 0);
      close();
    },
  });

  return (
    <form className="w-full" onSubmit={formik.handleSubmit}>
      <TextField
        fullWidth
        label="Jumlah Retur"
        variant="standard"
        type="number"
        name="jumlah"
        value={formik.values.jumlah}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.jumlah && Boolean(formik.errors.jumlah)}
        helperText={formik.touched.jumlah && formik.errors.jumlah}
      />
      <DialogActions>
        <Button onClick={close}>Cancel</Button>
        <Button type="submit">Retur</Button>
      </DialogActions>
    </form>
  );
}
