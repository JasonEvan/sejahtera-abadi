import { usePersediaanStore } from "@/hooks/lihat/usePersediaanStore";
import { PersediaanDTO } from "@/lib/types";
import { Autocomplete, Button, Grid, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function FormPersediaan() {
  const [namaBarang, setNamaBarang] = useState<string[]>([]);
  const [menuBarangLoading, setMenuBarangLoading] = useState<boolean>(false);
  const setData = usePersediaanStore((state) => state.setData);

  const formik = useFormik({
    initialValues: {
      namabarang: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);

        const encodedNamaBarang = encodeURIComponent(values.namabarang);
        const response = await fetch(
          `/api/barang/persediaan?namabarang=${encodedNamaBarang}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch persediaan data");
        }

        const { data, summary }: PersediaanDTO = await response.json();

        setData(data, summary);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred while fetching persediaan data.",
          confirmButtonText: "OK",
        });
        setData([], {
          totalQtyIn: 0,
          totalQtyOut: 0,
          stockAwal: 0,
          finalStock: 0,
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    async function fetchBarang() {
      try {
        setMenuBarangLoading(true);
        const response = await fetch("/api/barang/menu-beli", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch barang");
        }

        const {
          data,
        }: { data: { nama_barang: string; jual_barang: number }[] } =
          await response.json();

        setNamaBarang(data.map((item) => item.nama_barang));
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred while fetching barang.",
          confirmButtonText: "OK",
        });
        setNamaBarang([]);
      } finally {
        setMenuBarangLoading(false);
      }
    }

    fetchBarang();
  }, []);

  return (
    <form className="w-full" onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} marginBottom={2}>
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
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
                fullWidth
                error={
                  formik.touched.namabarang && Boolean(formik.errors.namabarang)
                }
                helperText={
                  formik.touched.namabarang && formik.errors.namabarang
                }
              />
            )}
          />
        </Grid>
      </Grid>
      <Button type="submit" variant="contained" loading={formik.isSubmitting}>
        Search
      </Button>
    </form>
  );
}
