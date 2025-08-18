import * as Yup from "yup";
import { useFormik } from "formik";
import {
  Autocomplete,
  Button,
  DialogActions,
  InputAdornment,
  TextField,
} from "@mui/material";
import { modals } from "@/lib/modal";
import { MenuBarangJual } from "@/hooks/useJualStore";
import { useMemo } from "react";
import { EditNotaTransaksiI } from "@/lib/types";

export default function AddTransaksiJualForm({
  menuBarang,
  dataNota,
  menuBarangLoading,
  decrementalId,
  addDataNota,
}: {
  menuBarang: MenuBarangJual[];
  dataNota: EditNotaTransaksiI[];
  menuBarangLoading: boolean;
  decrementalId: number;
  addDataNota: (data: EditNotaTransaksiI) => void;
}) {
  const isPersediaanEnough = (namaBarang: string, jumlah: number) => {
    const barang = menuBarang.find((item) => item.nama_barang === namaBarang);
    return barang ? jumlah <= barang.stock_akhir : false;
  };

  const validationSchema = Yup.object({
    namabarang: Yup.string()
      .required("Nama barang harus diisi")
      .min(3, "Nama barang minimal 3 karakter"),
    jumlah: Yup.number()
      .required("Jumlah barang harus diisi")
      .min(1, "Jumlah barang minimal 1"),
    harga: Yup.number()
      .required("Harga barang harus diisi")
      .min(0, "Harga barang tidak boleh kurang dari 0"),
  });

  const formik = useFormik({
    initialValues: {
      namabarang: "",
      jumlah: 0,
      harga: 0,
    },
    validationSchema,
    onSubmit: (values) => {
      if (!isPersediaanEnough(values.namabarang, values.jumlah)) {
        formik.setFieldError("jumlah", "Persediaan tidak cukup");
        return;
      }

      addDataNota({
        id: decrementalId,
        nama_barang: values.namabarang,
        qty_barang: values.jumlah,
        harga_barang: values.harga,
        total_harga: values.jumlah * values.harga,
        diskon_nota: dataNota[0].diskon_nota,
      });
      modals.close();
    },
  });

  const namaBarangOptions = useMemo(() => {
    return menuBarang.map((item) => item.nama_barang);
  }, [menuBarang]);

  return (
    <form className="w-full" onSubmit={formik.handleSubmit}>
      <Autocomplete
        disablePortal
        loading={menuBarangLoading}
        value={formik.values.namabarang}
        onChange={(event, newValue) => {
          formik.setFieldValue("namabarang", newValue || "");
        }}
        onBlur={() => formik.setFieldTouched("namabarang", true)}
        options={namaBarangOptions}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Nama Barang"
            variant="standard"
            fullWidth
            sx={{ marginBottom: 2 }}
            error={
              formik.touched.namabarang && Boolean(formik.errors.namabarang)
            }
            helperText={formik.touched.namabarang && formik.errors.namabarang}
          />
        )}
      />
      <TextField
        fullWidth
        label="Jumlah"
        variant="standard"
        type="number"
        name="jumlah"
        value={formik.values.jumlah}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.jumlah && Boolean(formik.errors.jumlah)}
        helperText={formik.touched.jumlah && formik.errors.jumlah}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        fullWidth
        label="Harga"
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
        <Button type="submit">Add</Button>
      </DialogActions>
    </form>
  );
}
