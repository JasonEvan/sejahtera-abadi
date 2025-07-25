import {
  Autocomplete,
  Box,
  Button,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useJualStore } from "@/hooks/useJualStore";
import Swal from "sweetalert2";

export default function NoteForm() {
  const {
    menuBarang,
    isLoading: menuBarangLoading,
    setDataPenjualan,
    incrementalId,
    incrementId,
    dataPenjualan,
    tambahTotalPenjualan,
    setTotalAkhir,
  } = useJualStore();
  const [namaBarang, setNamaBarang] = useState<string[]>([]);

  const isProfitable = (value: {
    namabarang: string;
    jumlah: number;
    modal: number;
    harga: number;
  }) => value.harga >= value.modal;

  const isPersediaanEnough = (value: {
    namabarang: string;
    jumlah: number;
    modal: number;
    harga: number;
  }) => {
    const totalStockInNote = dataPenjualan.reduce((acc: number, curr) => {
      if (curr.namaBarang === value.namabarang.split(" || ")[0].trim()) {
        return acc + curr.jumlah;
      }
      return acc;
    }, 0);

    const currTotalStock = value.jumlah + totalStockInNote;

    const availableStock = menuBarang.find(
      (item) => item.nama_barang === value.namabarang
    )?.stock_akhir;

    return currTotalStock <= (availableStock || 0);
  };

  const validationSchema = Yup.object({
    namabarang: Yup.string().required("Nama barang is required"),
    jumlah: Yup.number()
      .required("Jumlah is required")
      .min(1, "Jumlah must be at least 1"),
    modal: Yup.number()
      .required("Modal is required")
      .min(0, "Modal must be at least 0"),
    harga: Yup.number()
      .required("Harga is required")
      .min(0, "Harga must be at least 0"),
  });

  const formik = useFormik({
    initialValues: {
      namabarang: "",
      jumlah: 0,
      modal: 0,
      harga: 0,
    },
    validationSchema,
    onSubmit: (values) => {
      // validate if persediaan is enough
      if (!isPersediaanEnough(values)) {
        formik.setFieldError("jumlah", "Persediaan tidak cukup");
        return;
      }

      // validate if harga is greater than or equal to modal
      if (!isProfitable(values)) {
        Swal.fire({
          title: "Are you sure?",
          text: "Harga jual lebih kecil dari modal, apakah anda yakin?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, I'm sure!",
        }).then((result) => {
          if (result.isConfirmed) {
            setDataPenjualan({
              id: incrementalId,
              namaBarang: values.namabarang.split(" || ")[0].trim(),
              jumlah: values.jumlah,
              hargaSatuan: values.harga,
              modal: values.modal,
              subtotal: values.jumlah * values.harga,
            });
            incrementId();
            tambahTotalPenjualan(values.jumlah * values.harga);
            setTotalAkhir();
            formik.resetForm();
          }
        });
      } else {
        setDataPenjualan({
          id: incrementalId,
          namaBarang: values.namabarang.split(" || ")[0].trim(),
          jumlah: values.jumlah,
          hargaSatuan: values.harga,
          modal: values.modal,
          subtotal: values.jumlah * values.harga,
        });
        incrementId();
        tambahTotalPenjualan(values.jumlah * values.harga);
        setTotalAkhir();
        formik.resetForm();
      }
    },
  });

  useEffect(() => {
    if (menuBarang && menuBarang.length > 0) {
      const options = menuBarang.map((item) => item.nama_barang);
      setNamaBarang(options);
    }
  }, [menuBarang]);

  useEffect(() => {
    const data = menuBarang.find(
      (item) => item.nama_barang == formik.values.namabarang
    );
    if (data) {
      formik.setFieldValue("modal", data.modal);
      formik.setFieldValue("harga", data.jual_barang || 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.namabarang]);

  return (
    <Box>
      <form className="w-full" onSubmit={formik.handleSubmit}>
        <Grid container spacing={4} marginBottom={4}>
          <Grid size={{ xs: 12, sm: 12, md: 10, lg: 10 }}>
            <Autocomplete
              disablePortal
              loading={menuBarangLoading}
              value={formik.values.namabarang}
              onChange={(event, newValue) => {
                formik.setFieldValue("namabarang", newValue || "");
              }}
              onBlur={() => formik.setFieldTouched("namabarang", true)}
              options={namaBarang}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Nama Barang"
                  variant="outlined"
                  sx={{ width: "100%" }}
                  error={
                    formik.touched.namabarang &&
                    Boolean(formik.errors.namabarang)
                  }
                  helperText={
                    formik.touched.namabarang && formik.errors.namabarang
                  }
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 2, lg: 2 }}>
            <TextField
              label="Jumlah"
              type="number"
              variant="outlined"
              sx={{ width: "100%" }}
              name="jumlah"
              value={formik.values.jumlah}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.jumlah && Boolean(formik.errors.jumlah)}
              helperText={formik.touched.jumlah && formik.errors.jumlah}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              disabled
              label="Modal"
              type="number"
              variant="outlined"
              sx={{ width: "100%" }}
              name="modal"
              value={formik.values.modal}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.modal && Boolean(formik.errors.modal)}
              helperText={formik.touched.modal && formik.errors.modal}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">Rp</InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label="Harga Jual"
              type="number"
              variant="outlined"
              sx={{ width: "100%" }}
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
            />
          </Grid>
        </Grid>
        <Button variant="contained" type="submit">
          Add
        </Button>
      </form>
    </Box>
  );
}
