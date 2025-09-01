import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import Swal from "sweetalert2";

export default function Download() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/backup", {
        cache: "no-store",
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Failed to download backup data.");
      }

      const blob = await response.blob();
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
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Download Failed",
        text:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Download Backup Data
      </Typography>
      <Button
        variant="contained"
        color="primary"
        loading={isLoading}
        onClick={handleClick}
      >
        Download
      </Button>
      <Typography variant="body2" mt={2}>
        This proses may take a long process. Please wait the process patiently.
      </Typography>
    </Box>
  );
}
