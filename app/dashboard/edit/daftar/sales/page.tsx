"use client";

import SalesTable from "@/components/edit/daftar/SalesTable";
import { Box, Typography } from "@mui/material";

export default function SalesPage() {
  return (
    <Box>
      <Typography variant="h6" gutterBottom marginBottom={2}>
        Edit Daftar Salesman
      </Typography>
      <SalesTable />
    </Box>
  );
}
