"use client";

import UtangSemuaTable from "@/components/lihat/utang/UtangSemuaTable";
import { Box, Button, Typography } from "@mui/material";

export default function UtangPage() {
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
        Utang Semua Langganan
      </Typography>

      <Button
        variant="contained"
        color="info"
        onClick={() => window.print()}
        sx={{ displayPrint: "none" }}
      >
        Print
      </Button>

      <UtangSemuaTable />
    </Box>
  );
}
