import { deleteData } from "@/service/dataService";
import { Box, Button, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Swal from "sweetalert2";

export default function DeleteData() {
  const deleteMutation = useMutation({
    mutationFn: deleteData,
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "All data deleted successfully.",
        confirmButtonText: "OK",
      });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Unknown error";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonText: "OK",
      });
    },
  });

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will delete all data permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      deleteMutation.mutate();
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Delete All Data
      </Typography>
      <Button
        variant="contained"
        color="error"
        loading={deleteMutation.isPending}
        onClick={handleDelete}
      >
        Delete
      </Button>
      <Typography variant="body2" mt={2} color="error">
        !! Warning: This action is irreversible. All your data will be
        permanently deleted !!
      </Typography>
    </Box>
  );
}
