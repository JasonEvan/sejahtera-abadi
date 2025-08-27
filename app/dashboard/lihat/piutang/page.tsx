"use client";

import PiutangSemuaTable from "@/components/lihat/piutang/PiutangSemuaTable";
import { Box, Button, Typography } from "@mui/material";

export default function PiutangPage() {
  return (
    <Box>
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}</style>

      <Typography variant="h6" gutterBottom sx={{ displayPrint: "none" }}>
        Piutang Semua Langganan
      </Typography>

      <Button
        variant="contained"
        color="info"
        onClick={() => window.print()}
        sx={{ marginY: 2, displayPrint: "none" }}
      >
        Print
      </Button>

      <PiutangSemuaTable />
    </Box>
  );
}
