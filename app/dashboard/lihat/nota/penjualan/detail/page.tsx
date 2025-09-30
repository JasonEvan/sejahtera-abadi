"use client";

import NotaTable from "@/components/lihat/nota/NotaTable";
import { useDetailNotaStore } from "@/hooks/useDetailNotaStore";
import { rupiahToString } from "@/lib/rupiahToString";
import { Box, Button, Typography } from "@mui/material";

export default function NotaPenjualanPage() {
  const { details, total } = useDetailNotaStore();

  return (
    <Box>
      <style>{`
        @media print {
          @page {
            size: 21.7cm 14cm;
            margin: 0;
            margin-bottom: 2.5cm;
          }
        }
      `}</style>

      <Button
        variant="contained"
        color="info"
        onClick={() => window.print()}
        sx={{ marginY: 2, displayPrint: "none" }}
      >
        Print
      </Button>

      <NotaTable data={details} totalHargaSemua={total} />

      <Box sx={{ display: "none", displayPrint: "block" }}>
        <Typography
          variant="caption"
          align="left"
          sx={{
            marginLeft: 2,
            marginTop: 1,
            fontFamily: "monospace",
            fontSize: "10px",
          }}
        >
          {rupiahToString(parseInt(total.replaceAll(".", "")))} rupiah
        </Typography>
      </Box>
    </Box>
  );
}
