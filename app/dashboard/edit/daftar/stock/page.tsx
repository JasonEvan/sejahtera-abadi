"use client";

import StockTable from "@/components/edit/daftar/StockTable";
import { Box, Typography } from "@mui/material";

export default function StockPage() {
  return (
    <Box>
      <Typography variant="h6" gutterBottom marginBottom={2}>
        Edit Daftar Stock
      </Typography>
      <StockTable />
    </Box>
  );
}
