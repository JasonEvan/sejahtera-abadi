import { client } from "@/app/generated/prisma";
import { modals } from "@/lib/modal";
import { Button, DialogActions, TextField } from "@mui/material";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";

interface EditClientFormProps extends client {
  onSaveSuccess: () => void;
}

export default function EditClientForm({
  id,
  nama_client,
  kota_client,
  alamat_client,
  telp_client,
  hp_client,
  onSaveSuccess,
}: EditClientFormProps) {
  const validationSchema = Yup.object({
    namaclient: Yup.string().required("Nama client is required"),
    kotaclient: Yup.string(),
    alamatclient: Yup.string(),
    telpclient: Yup.string(),
    hpclient: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      namaclient: nama_client || "",
      kotaclient: kota_client || "",
      alamatclient: alamat_client || "",
      telpclient: telp_client || "",
      hpclient: hp_client || "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        const response = await fetch(`/api/client/${id}`, {
          cache: "no-store",
          method: "PUT",
          body: JSON.stringify({
            nama_client: values.namaclient,
            kota_client: values.kotaclient,
            alamat_client: values.alamatclient,
            telp_client: values.telpclient,
            hp_client: values.hpclient,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update client");
        }

        modals.close();
        onSaveSuccess();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Client updated successfully",
          confirmButtonText: "OK",
        });
      } catch (error) {
        alert(
          error instanceof Error ? error.message : "Failed to update client"
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
        label="Nama Client"
        variant="standard"
        name="namaclient"
        value={formik.values.namaclient}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.namaclient && Boolean(formik.errors.namaclient)}
        helperText={formik.touched.namaclient && formik.errors.namaclient}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        fullWidth
        label="Kota Client"
        variant="standard"
        name="kotaclient"
        value={formik.values.kotaclient}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.kotaclient && Boolean(formik.errors.kotaclient)}
        helperText={formik.touched.kotaclient && formik.errors.kotaclient}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        fullWidth
        label="Alamat Client"
        variant="standard"
        name="alamatclient"
        value={formik.values.alamatclient}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.alamatclient && Boolean(formik.errors.alamatclient)
        }
        helperText={formik.touched.alamatclient && formik.errors.alamatclient}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        fullWidth
        label="Telp Client"
        variant="standard"
        name="telpclient"
        value={formik.values.telpclient}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.telpclient && Boolean(formik.errors.telpclient)}
        helperText={formik.touched.telpclient && formik.errors.telpclient}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        fullWidth
        label="HP Client"
        variant="standard"
        name="hpclient"
        value={formik.values.hpclient}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.hpclient && Boolean(formik.errors.hpclient)}
        helperText={formik.touched.hpclient && formik.errors.hpclient}
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
