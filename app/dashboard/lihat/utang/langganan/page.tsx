"use client";

import FormLangganan from "@/components/lihat/utang/FormLangganan";
import UtangLanggananTable from "@/components/lihat/utang/UtangLanggananTable";
import { Box, Typography } from "@mui/material";
import { useState } from "react";

export default function UtangPerLanggananPage() {
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
        Utang Langganan
      </Typography>
      <FormLangganan setLangganan={setLangganan} />
      <UtangLanggananTable langganan={langganan} />
    </Box>
  );
}
