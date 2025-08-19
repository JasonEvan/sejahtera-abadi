"use client";

import UtangSemuaTable from "@/components/lihat/utang/UtangSemuaTable";
import { Box, Typography } from "@mui/material";

export default function UtangPage() {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Utang Semua Langganan
      </Typography>
      <UtangSemuaTable />
    </Box>
  );
}
