import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import Swal from "sweetalert2";

export default function DeleteData() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be revert",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, I'm sure!",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/backup", {
        method: "DELETE",
        cache: "no-store",
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Failed to delete data");
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "All data deleted successfully.",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error instanceof Error ? error.message : "Unknown error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
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
        loading={isLoading}
        onClick={handleClick}
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
