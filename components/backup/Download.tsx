import { backupData } from "@/service/dataService";
import { Box, Button, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Swal from "sweetalert2";

export default function Download() {
  const downloadMutation = useMutation({
    mutationFn: backupData,
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "backup.sql";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      Swal.fire({
        icon: "success",
        title: "Backup Downloaded",
        text: "The backup data has been downloaded successfully.",
        confirmButtonText: "OK",
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Download Failed",
        text:
          error instanceof AxiosError
            ? error.response?.data?.error || error.message
            : "An unexpected error occurred.",
        confirmButtonText: "OK",
      });
    },
  });

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Download Backup Data
      </Typography>
      <Button
        variant="contained"
        color="primary"
        loading={downloadMutation.isPending}
        onClick={() => downloadMutation.mutate()}
      >
        Download
      </Button>
      <Typography variant="body2" mt={2}>
        This proses may take a long process. Please wait the process patiently.
      </Typography>
    </Box>
  );
}
