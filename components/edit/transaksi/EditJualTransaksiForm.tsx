import * as Yup from "yup";
import { useFormik } from "formik";
import {
  Autocomplete,
  Button,
  DialogActions,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useEditJualStore } from "@/hooks/edit/useEditJualStore";
import { modals } from "@/lib/modal";
import { useMemo } from "react";
import { EditNotaTransaksiI } from "@/lib/types";

export default function EditJualTransaksiForm({
  row,
}: {
  row: EditNotaTransaksiI;
}) {
  const { menuBarang, menuBarangLoading, updateDataNota } = useEditJualStore();

  const isPersediaanEnough = (
    newNamaBarang: string,
    newQty: number
  ): boolean => {
    const barang = menuBarang.find(
      (item) => item.nama_barang === newNamaBarang
    );
    if (!barang) return false;

    if (row.nama_barang !== newNamaBarang) {
      // Jika nama barang berubah, cek stok total untuk barang baru
      return newQty <= barang.stock_akhir;
    } else {
      // Jika nama barang sama, hitung selisihnya
      const selisih = newQty - row.qty_barang;
      // Jika selisih > 0, berarti kita butuh stok tambahan
      // Jika selisih <= 0, berarti stok dikembalikan (pasti cukup)
      return selisih <= barang.stock_akhir;
    }
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
      namabarang: row.nama_barang,
      jumlah: row.qty_barang,
      harga: row.harga_barang,
    },
    validationSchema,
    onSubmit: (values) => {
      if (!isPersediaanEnough(values.namabarang, values.jumlah)) {
        formik.setFieldError("jumlah", "Persediaan tidak cukup");
        return;
      }

      updateDataNota({
        ...row,
        nama_barang: values.namabarang,
        qty_barang: values.jumlah,
        harga_barang: values.harga,
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
        <Button type="submit">Update</Button>
      </DialogActions>
    </form>
  );
}
