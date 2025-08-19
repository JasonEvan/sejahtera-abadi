"use client";

import FormPersediaan from "@/components/lihat/persediaan/FormPersediaan";
import PersediaanTable from "@/components/lihat/persediaan/PersediaanTable";
import { Box, Typography } from "@mui/material";

export default function KartuPersediaanPage() {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Kartu Persediaan
      </Typography>
      <FormPersediaan />
      <PersediaanTable />
    </Box>
  );
}
