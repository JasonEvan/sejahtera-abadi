import {
  DataPenjualanI,
  MenuBarangJual,
  useJualStore,
} from "@/hooks/useJualStore";
import { modals } from "@/lib/modal";
import {
  Autocomplete,
  Button,
  DialogActions,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function EditJualForm({ row }: { row: DataPenjualanI }) {
  const menuBarang = useJualStore((state) => state.menuBarang);
  const menuBarangLoading = useJualStore((state) => state.isLoading);
  const updateDataPenjualan = useJualStore(
    (state) => state.updateDataPenjualan
  );

  const isPersediaanEnough = (
    newNamaBarang: string,
    newQty: number
  ): boolean => {
    const barang = menuBarang.find(
      (item) => item.nama_barang === newNamaBarang
    );
    if (!barang) return false;

    if (row.namaBarang !== newNamaBarang) {
      // Jika nama barang berubah, cek stok total untuk barang baru
      return newQty <= barang.stock_akhir;
    } else {
      // Jika nama barang sama, hitung selisihnya
      const selisih = newQty - row.jumlah;
      // Jika selisih > 0, berarti kita butuh stok tambahan
      // Jika selisih <= 0, berarti stok dikembalikan (pasti cukup)
      return selisih <= barang.stock_akhir;
    }
  };

  const isProfitable = (newNamaBarang: string, newHarga: number): boolean => {
    const barang = menuBarang.find(
      (item) => item.nama_barang === newNamaBarang
    );
    if (!barang) return false;

    return newHarga >= barang.modal;
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
      namabarang: row.namaBarang,
      jumlah: row.jumlah,
      harga: row.hargaSatuan,
    },
    validationSchema,
    onSubmit: (values) => {
      if (!isPersediaanEnough(values.namabarang, values.jumlah)) {
        formik.setFieldError("jumlah", "Persediaan tidak cukup");
        return;
      }

      if (!isProfitable(values.namabarang, values.harga)) {
        const sure = confirm("Harga jual di bawah modal. Lanjutkan?");
        if (!sure) return;
      }

      updateDataPenjualan({
        ...row,
        namaBarang: values.namabarang,
        jumlah: values.jumlah,
        hargaSatuan: values.harga,
      });
      modals.close();
    },
  });

  return (
    <form className="w-full" onSubmit={formik.handleSubmit}>
      <Autocomplete
        disablePortal
        loading={menuBarangLoading}
        options={menuBarang}
        // gunakan getOptionLabel untuk memformat tampilan opsi
        getOptionLabel={(option) =>
          `${option.nama_barang} || ${option.stock_akhir}`
        }
        value={
          menuBarang.find(
            (item) => item.nama_barang === formik.values.namabarang
          ) || null
        }
        onChange={(event, newValue: MenuBarangJual | null) => {
          formik.setFieldValue("namabarang", newValue?.nama_barang || "");
        }}
        onBlur={() => formik.setFieldTouched("namabarang", true)}
        isOptionEqualToValue={(option, value) =>
          option.nama_barang === value.nama_barang
        }
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
