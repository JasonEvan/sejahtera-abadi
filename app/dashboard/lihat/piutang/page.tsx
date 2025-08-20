"use client";

import PiutangSemuaTable from "@/components/lihat/piutang/PiutangSemuaTable";
import { Box, Typography } from "@mui/material";

export default function PiutangPage() {
  return (
    <Box>
      <Box>
        <Typography variant="h6" gutterBottom>
          Piutang Semua Langganan
        </Typography>
        <PiutangSemuaTable />
      </Box>
    </Box>
  );
}
