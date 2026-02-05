import { usePersediaanStore } from "@/hooks/lihat/usePersediaanStore";
import { getMenuBeli, getPersediaan } from "@/service/barangService";
import { Autocomplete, Button, Grid, TextField } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useEffect } from "react";
import Swal from "sweetalert2";

type FormPersediaanProps = {
  setBarang: React.Dispatch<React.SetStateAction<string>>;
};

export default function FormPersediaan({ setBarang }: FormPersediaanProps) {
  const setData = usePersediaanStore((state) => state.setData);
  const dataTable = usePersediaanStore((state) => state.data);

  const {
    data: namaBarang,
    isLoading: menuBarangLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["barang", "menu-beli"],
    queryFn: getMenuBeli,
  });

  useEffect(() => {
    if (isError) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while fetching menu barang.",
        confirmButtonText: "OK",
      });
    }
  }, [isError, error]);

  const persediaanMutation = useMutation({
    mutationFn: getPersediaan,
    onSuccess: (data) => {
      setData(data.data, data.summary);
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof AxiosError
          ? error.message
          : "An unexpected error occurred while fetching persediaan data.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonText: "OK",
      });
      setData([], {
        totalQtyIn: 0,
        totalQtyOut: 0,
        stockAwal: 0,
        finalStock: 0,
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      namabarang: "",
    },
    onSubmit: (values) => {
      setBarang(values.namabarang);
      persediaanMutation.mutate(values.namabarang);
    },
  });

  return (
    <>
      <form className="w-full" onSubmit={formik.handleSubmit}>
        <Grid
          container
          spacing={2}
          marginBottom={2}
          sx={{ displayPrint: "none" }}
        >
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
            <Autocomplete
              disablePortal
              loading={menuBarangLoading}
              value={formik.values.namabarang}
              onChange={(event, newValue) => {
                formik.setFieldValue("namabarang", newValue || "");
              }}
              onBlur={() => formik.setFieldTouched("namabarang", true)}
              options={namaBarang?.map((item) => item.nama_barang) || []}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Nama Barang"
                  variant="outlined"
                  fullWidth
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
        </Grid>
        <Button
          type="submit"
          variant="contained"
          loading={persediaanMutation.isPending}
          sx={{ displayPrint: "none" }}
        >
          Search
        </Button>
      </form>
      {dataTable.length > 0 && (
        <Button
          variant="contained"
          color="info"
          onClick={() => window.print()}
          sx={{ marginY: 2, displayPrint: "none" }}
        >
          Print
        </Button>
      )}
    </>
  );
}
