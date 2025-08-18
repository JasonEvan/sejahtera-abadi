"use client";

import ClientTable from "@/components/edit/daftar/ClientTable";
import { Box, Typography } from "@mui/material";

export default function ClientPage() {
  return (
    <Box>
      <Typography variant="h6" gutterBottom marginBottom={2}>
        Edit Daftar Client
      </Typography>
      <ClientTable />
    </Box>
  );
}
