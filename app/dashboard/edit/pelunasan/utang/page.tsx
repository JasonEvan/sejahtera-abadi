"use client";

import {
  Box,
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useEditLunasUtangStore } from "@/hooks/edit/useEditLunasStore";
import NoteTable from "@/components/edit/pelunasan/NoteTable";
import Swal from "sweetalert2";

export default function PelunasanUtangPage() {
  const {
    nomorNotaDone,
    dataPelunasan,
    nilai_nota,
    lunas_nota,
    saldo_nota,
    isSubmitting,
    isDeleting,
    setNomorNota,
    setNomorNotaDone,
    fetchDataPelunasan,
    updateDataNota,
    deleteDataNota,
    submitEdit,
    submitDelete,
  } = useEditLunasUtangStore();

  const validationSchema = Yup.object({
    nomornota: Yup.string().required("Nomor nota is required"),
  });

  const formik = useFormik({
    initialValues: {
      nomornota: "",
    },
    validationSchema,
    onSubmit: (values) => {
      setNomorNota(values.nomornota);
      setNomorNotaDone();
      fetchDataPelunasan(values.nomornota);
    },
  });

  const handleSubmitEdit = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, I'm sure!",
    });

    if (!result.isConfirmed) return;

    const success = await submitEdit();
    if (success) {
      formik.resetForm();
    }
  };

  const handleSubmitDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, I'm sure!",
    });

    if (!result.isConfirmed) return;

    const success = await submitDelete();
    if (success) {
      formik.resetForm();
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom marginBottom={2}>
        Edit Pelunasan Utang
      </Typography>
      <form className="w-full" onSubmit={formik.handleSubmit}>
        <Grid container spacing={4} marginBottom={4}>
          <Grid size={6}>
            <TextField
              label="Nomor Nota"
              variant="outlined"
              fullWidth
              name="nomornota"
              value={formik.values.nomornota}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.nomornota && Boolean(formik.errors.nomornota)
              }
              helperText={formik.touched.nomornota && formik.errors.nomornota}
              disabled={nomorNotaDone}
            />
          </Grid>
        </Grid>
        <Button variant="contained" type="submit" disabled={nomorNotaDone}>
          Search
        </Button>
      </form>
      <Divider sx={{ color: "#cccccc" }}>Data Pelunasan</Divider>
      <Box sx={{ display: nomorNotaDone ? "block" : "none" }}>
        <NoteTable
          dataNota={dataPelunasan}
          nilai_nota={nilai_nota}
          lunas_nota={lunas_nota}
          saldo_nota={saldo_nota}
          updateDataNota={updateDataNota}
          deleteDataNota={deleteDataNota}
        />
        <Stack direction="row" spacing={2} marginTop={2}>
          <Button
            variant="contained"
            onClick={handleSubmitEdit}
            loading={isSubmitting || isDeleting}
          >
            Submit
          </Button>
          <Button
            variant="contained"
            color="error"
            loading={isSubmitting || isDeleting}
            onClick={handleSubmitDelete}
          >
            Delete
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
