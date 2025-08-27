"use client";

import FormLangganan from "@/components/lihat/piutang/FormLangganan";
import PiutangLanggananTable from "@/components/lihat/piutang/PiutangLanggananTable";
import { Box, Typography } from "@mui/material";
import { useState } from "react";

export default function PiutangPerLanggananPage() {
  const [langganan, setLangganan] = useState<string>("");

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
        Piutang Langganan
      </Typography>
      <FormLangganan setLangganan={setLangganan} />
      <PiutangLanggananTable langganan={langganan} />
    </Box>
  );
}
