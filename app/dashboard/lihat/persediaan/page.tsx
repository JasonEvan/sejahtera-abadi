"use client";

import FormPersediaan from "@/components/lihat/persediaan/FormPersediaan";
import PersediaanTable from "@/components/lihat/persediaan/PersediaanTable";
import { Box, Typography } from "@mui/material";
import { useState } from "react";

export default function KartuPersediaanPage() {
  const [barang, setBarang] = useState<string>("");

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
        Kartu Persediaan
      </Typography>
      <FormPersediaan setBarang={setBarang} />
      <PersediaanTable barang={barang} />
    </Box>
  );
}
